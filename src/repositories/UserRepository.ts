import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '../services/firebase';
import { UserProfile } from '../types';

export class UserRepository {
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const snap = await getDoc(doc(db, 'users', userId));
      if (snap.exists()) {
        return snap.data() as UserProfile;
      }
      return null;
    } catch (e) {
      console.warn('Could not fetch user profile from Firestore:', e);
      return null;
    }
  }

  static async saveUserProfile(profile: UserProfile): Promise<void> {
    try {
      const userRef = doc(db, 'users', profile.userId);
      await setDoc(userRef, {
        ...profile,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn('Error saving profile to Firestore:', e);
    }
  }

  static async updateStreak(userId: string, newStreak: number, totalWorkouts: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        streakDays: newStreak,
        totalWorkoutsDone: totalWorkouts,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Error updating streak in Firestore:', e);
    }
  }

  static async deleteAccount(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', userId));
      if (auth.currentUser && auth.currentUser.uid === userId) {
        await deleteUser(auth.currentUser);
      }
    } catch (e) {
      console.warn('Error deleting account:', e);
      throw e;
    }
  }
}
