import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { UserProfile } from '../types';

const googleProvider = new GoogleAuthProvider();

export class AuthRepository {
  static onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  static async registerWithEmail(email: string, pass: string, name: string): Promise<UserProfile> {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const userId = cred.user.uid;
    const now = new Date().toISOString();

    const newProfile: UserProfile = {
      userId,
      name: name || 'ورزشکار عزیز',
      email,
      streakDays: 1,
      totalWorkoutsDone: 0,
      trainingDaysPerWeek: 5,
      fitnessLevel: 'intermediate',
      goal: 'muscle_gain',
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(db, 'users', userId), newProfile);
    return newProfile;
  }

  static async loginWithEmail(email: string, pass: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return cred.user;
  }

  static async loginWithGoogle(): Promise<User> {
    const cred = await signInWithPopup(auth, googleProvider);
    const user = cred.user;

    // Check if profile exists, if not create default
    const userDocRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      const now = new Date().toISOString();
      const profile: UserProfile = {
        userId: user.uid,
        name: user.displayName || 'علیرضا',
        email: user.email || '',
        profileImage: user.photoURL || undefined,
        streakDays: 1,
        totalWorkoutsDone: 0,
        trainingDaysPerWeek: 5,
        fitnessLevel: 'intermediate',
        goal: 'muscle_gain',
        createdAt: now,
        updatedAt: now,
      };
      await setDoc(userDocRef, profile);
    }
    return user;
  }

  static async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  static async logout(): Promise<void> {
    await signOut(auth);
  }
}
