import { doc, getDoc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../services/firebase';

export interface FavoriteItem {
  id: string;
  type: 'exercise' | 'article' | 'video';
  title: string;
  subtitle?: string;
  category?: string;
  savedAt: string;
  rawItem?: any;
}

export class FavoritesRepository {
  private static LOCAL_KEY = 'polad_favorites';

  static getLocalFavorites(): FavoriteItem[] {
    try {
      const saved = localStorage.getItem(this.LOCAL_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  static saveLocalFavorites(items: FavoriteItem[]) {
    try {
      localStorage.setItem(this.LOCAL_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Error saving local favorites:', e);
    }
  }

  static async toggleFavorite(
    userId: string | undefined,
    item: { id: string; type: 'exercise' | 'article' | 'video'; title: string; subtitle?: string; category?: string; rawItem?: any }
  ): Promise<boolean> {
    const list = this.getLocalFavorites();
    const existingIndex = list.findIndex((f) => f.id === item.id && f.type === item.type);
    let isNowFavorite = false;

    if (existingIndex >= 0) {
      list.splice(existingIndex, 1);
      isNowFavorite = false;
    } else {
      list.push({
        ...item,
        savedAt: new Date().toISOString(),
      });
      isNowFavorite = true;
    }

    this.saveLocalFavorites(list);

    if (userId && userId !== 'guest') {
      try {
        const docRef = doc(db, `users/${userId}/favorites`, `${item.type}_${item.id}`);
        if (isNowFavorite) {
          await setDoc(docRef, {
            id: item.id,
            type: item.type,
            title: item.title,
            subtitle: item.subtitle || '',
            category: item.category || '',
            savedAt: new Date().toISOString(),
          });
        } else {
          await deleteDoc(docRef);
        }
      } catch (e) {
        console.warn('Error syncing favorite to Firestore:', e);
      }
    }

    return isNowFavorite;
  }

  static isFavorite(id: string, type: 'exercise' | 'article' | 'video'): boolean {
    const list = this.getLocalFavorites();
    return list.some((f) => f.id === id && f.type === type);
  }

  static async getAllFavorites(userId?: string): Promise<FavoriteItem[]> {
    const local = this.getLocalFavorites();
    if (!userId || userId === 'guest') {
      return local;
    }

    try {
      const snap = await getDocs(collection(db, `users/${userId}/favorites`));
      if (!snap.empty) {
        const remote = snap.docs.map((d) => d.data() as FavoriteItem);
        this.saveLocalFavorites(remote);
        return remote;
      }
    } catch (e) {
      console.warn('Error fetching favorites from Firestore:', e);
    }

    return local;
  }
}
