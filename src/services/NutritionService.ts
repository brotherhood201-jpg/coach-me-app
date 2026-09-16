import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { NutritionLog, MealItem, FoodItem, FoodPreferences } from '../types';
import { INITIAL_FOOD_DATABASE } from '../data/foodDatabase';

export class NutritionService {
  private static LOCAL_NUTRITION_PREFIX = 'polad_nutrition_';
  private static CUSTOM_FOODS_KEY = 'polad_custom_foods';

  static getTodayDateStr(): string {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static getCustomFoods(): FoodItem[] {
    try {
      const saved = localStorage.getItem(this.CUSTOM_FOODS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  }

  static saveCustomFood(food: Omit<FoodItem, 'id'>): FoodItem {
    const customList = this.getCustomFoods();
    const newFood: FoodItem = {
      id: `custom_food_${Date.now()}`,
      ...food,
      createdAt: new Date().toISOString(),
    };
    const updated = [newFood, ...customList];
    try {
      localStorage.setItem(this.CUSTOM_FOODS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Error saving custom food:', e);
    }
    return newFood;
  }

  static getAllFoods(): FoodItem[] {
    const custom = this.getCustomFoods();
    return [...custom, ...INITIAL_FOOD_DATABASE];
  }

  static getLocalLog(userId: string, dateStr: string = this.getTodayDateStr()): NutritionLog {
    const key = `${this.LOCAL_NUTRITION_PREFIX}${userId}_${dateStr}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }

    // Default template with realistic initial meals to showcase the UI immediately
    const initialMeals: MealItem[] = [
      {
        id: 'meal-b1',
        foodId: 'food-rolled-oats',
        name: 'جو دوسر پرک با شیر کم‌چرب',
        calories: 320,
        protein: 16,
        carbs: 52,
        fat: 4.5,
        amountGrams: 80,
        time: '۰۸:۳۰',
        mealType: 'breakfast',
      },
      {
        id: 'meal-b2',
        foodId: 'food-boiled-egg',
        name: 'تخم‌مرغ آب‌پز (۲ عدد)',
        calories: 155,
        protein: 13,
        carbs: 1,
        fat: 11,
        amountGrams: 100,
        time: '۰۸:۴۵',
        mealType: 'breakfast',
      },
      {
        id: 'meal-l1',
        foodId: 'food-chicken-breast',
        name: 'سینه مرغ گریل شده',
        calories: 330,
        protein: 62,
        carbs: 0,
        fat: 7.2,
        amountGrams: 200,
        time: '۱۳:۳۰',
        mealType: 'lunch',
      },
      {
        id: 'meal-l2',
        foodId: 'food-white-rice',
        name: 'برنج کته کم‌روغن',
        calories: 260,
        protein: 5.4,
        carbs: 56,
        fat: 0.6,
        amountGrams: 200,
        time: '۱۳:۳۰',
        mealType: 'lunch',
      },
      {
        id: 'meal-s1',
        foodId: 'food-banana',
        name: 'موز تازه + کره بادام‌زمینی',
        calories: 235,
        protein: 6.2,
        carbs: 28,
        fat: 12,
        amountGrams: 120,
        time: '۱۷:۰۰',
        mealType: 'snack',
      },
      {
        id: 'meal-d1',
        foodId: 'food-grilled-salmon',
        name: 'فیله قزل‌آلا با سالاد زیتون',
        calories: 340,
        protein: 34,
        carbs: 8,
        fat: 18,
        amountGrams: 180,
        time: '۲۱:۰۰',
        mealType: 'dinner',
      },
    ];

    const totalCals = initialMeals.reduce((acc, m) => acc + m.calories, 0);
    const totalP = initialMeals.reduce((acc, m) => acc + m.protein, 0);
    const totalC = initialMeals.reduce((acc, m) => acc + m.carbs, 0);
    const totalF = initialMeals.reduce((acc, m) => acc + m.fat, 0);

    return {
      id: `nutrition_${dateStr}`,
      userId,
      date: dateStr,
      calories: totalCals, // 1640 kcal
      targetCalories: 2150, // User's custom daily target
      protein: totalP,
      targetProtein: 145,
      carbs: totalC,
      targetCarbs: 220,
      fat: totalF,
      targetFat: 65,
      water: 5,
      targetWater: 8,
      meals: initialMeals,
    };
  }

  static saveLocalLog(log: NutritionLog): void {
    const key = `${this.LOCAL_NUTRITION_PREFIX}${log.userId}_${log.date}`;
    try {
      localStorage.setItem(key, JSON.stringify(log));
    } catch (e) {
      console.warn('Could not save local nutrition log:', e);
    }
  }

  /**
   * Fetch nutrition log from Firestore or local storage
   */
  static async getNutritionLog(userId: string, dateStr: string = this.getTodayDateStr()): Promise<NutritionLog> {
    const local = this.getLocalLog(userId, dateStr);
    if (!userId || userId === 'guest') return local;

    try {
      const ref = doc(db, `users/${userId}/nutritionLogs/${dateStr}`);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data() as NutritionLog;
        this.saveLocalLog(data);
        return data;
      }
    } catch (e) {
      console.warn('Error fetching nutrition log from Firestore:', e);
    }

    return local;
  }

  /**
   * Add a meal item to today's log
   */
  static async addMealItem(
    userId: string,
    mealData: {
      foodId?: string;
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      amountGrams?: number;
      mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    },
    dateStr: string = this.getTodayDateStr()
  ): Promise<NutritionLog> {
    const current = await this.getNutritionLog(userId, dateStr);
    const existingMeals = current.meals || [];

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newMealItem: MealItem = {
      id: `meal_${Date.now()}`,
      foodId: mealData.foodId,
      name: mealData.name,
      calories: Math.round(mealData.calories),
      protein: Math.round(mealData.protein * 10) / 10,
      carbs: Math.round(mealData.carbs * 10) / 10,
      fat: Math.round(mealData.fat * 10) / 10,
      amountGrams: mealData.amountGrams,
      time: timeStr,
      mealType: mealData.mealType,
    };

    const updatedMeals = [...existingMeals, newMealItem];

    const totalCalories = updatedMeals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = Math.round(updatedMeals.reduce((sum, m) => sum + m.protein, 0));
    const totalCarbs = Math.round(updatedMeals.reduce((sum, m) => sum + m.carbs, 0));
    const totalFat = Math.round(updatedMeals.reduce((sum, m) => sum + m.fat, 0));

    const updatedLog: NutritionLog = {
      ...current,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      meals: updatedMeals,
    };

    this.saveLocalLog(updatedLog);

    if (userId && userId !== 'guest') {
      try {
        await setDoc(doc(db, `users/${userId}/nutritionLogs/${dateStr}`), updatedLog, { merge: true });
      } catch (e) {
        console.warn('Error saving meal to Firestore:', e);
      }
    }

    return updatedLog;
  }

  /**
   * Delete a meal item
   */
  static async deleteMealItem(
    userId: string,
    mealId: string,
    dateStr: string = this.getTodayDateStr()
  ): Promise<NutritionLog> {
    const current = await this.getNutritionLog(userId, dateStr);
    const updatedMeals = (current.meals || []).filter((m) => m.id !== mealId);

    const totalCalories = updatedMeals.reduce((sum, m) => sum + m.calories, 0);
    const totalProtein = Math.round(updatedMeals.reduce((sum, m) => sum + m.protein, 0));
    const totalCarbs = Math.round(updatedMeals.reduce((sum, m) => sum + m.carbs, 0));
    const totalFat = Math.round(updatedMeals.reduce((sum, m) => sum + m.fat, 0));

    const updatedLog: NutritionLog = {
      ...current,
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      meals: updatedMeals,
    };

    this.saveLocalLog(updatedLog);

    if (userId && userId !== 'guest') {
      try {
        await setDoc(doc(db, `users/${userId}/nutritionLogs/${dateStr}`), updatedLog, { merge: true });
      } catch (e) {
        console.warn('Error deleting meal in Firestore:', e);
      }
    }

    return updatedLog;
  }

  /**
   * Set target calories and macros
   */
  static async setTargetMacros(
    userId: string,
    targets: { calories: number; protein?: number; carbs?: number; fat?: number },
    dateStr: string = this.getTodayDateStr()
  ): Promise<NutritionLog> {
    const current = await this.getNutritionLog(userId, dateStr);
    const updatedLog: NutritionLog = {
      ...current,
      targetCalories: targets.calories,
      targetProtein: targets.protein ?? Math.round((targets.calories * 0.28) / 4),
      targetCarbs: targets.carbs ?? Math.round((targets.calories * 0.45) / 4),
      targetFat: targets.fat ?? Math.round((targets.calories * 0.27) / 9),
    };

    this.saveLocalLog(updatedLog);

    if (userId && userId !== 'guest') {
      try {
        await setDoc(doc(db, `users/${userId}/nutritionLogs/${dateStr}`), updatedLog, { merge: true });
      } catch (e) {
        console.warn('Error updating macro targets in Firestore:', e);
      }
    }

    return updatedLog;
  }

  /**
   * Save food preferences
   */
  static async saveFoodPreferences(userId: string, preferences: FoodPreferences): Promise<void> {
    const key = `polad_food_prefs_${userId}`;
    try {
      localStorage.setItem(key, JSON.stringify(preferences));
    } catch (e) {
      console.warn('Error saving food preferences to localStorage:', e);
    }

    if (userId && userId !== 'guest') {
      try {
        await setDoc(doc(db, `users/${userId}`), { foodPreferences: preferences }, { merge: true });
      } catch (e) {
        console.warn('Error saving food preferences to Firestore:', e);
      }
    }
  }

  static getFoodPreferences(userId: string): FoodPreferences {
    const key = `polad_food_prefs_${userId}`;
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }

    return {
      favoriteFoods: ['سینه مرغ گریل', 'برنج کته', 'تخم‌مرغ آب‌پز', 'موز', 'جو دوسر'],
      dislikedFoods: ['سوسیس و کالباس', 'نوشابه گازدار'],
      allergies: [],
      restrictions: [],
      allergyNoticeAcknowledged: true,
    };
  }
}
