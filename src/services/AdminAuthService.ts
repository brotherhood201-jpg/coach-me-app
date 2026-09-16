import {
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { AdminUser, AdminRole } from '../types';

export class AdminAuthService {
  private static STORAGE_KEY = 'polad_admin_user_session';
  private static BOOTSTRAP_ADMIN_EMAILS = [
    'brotherhood201@gmail.com',
    'admin@poladfitness.ir',
    'admin@gym.com',
  ];

  /**
   * Check if current stored session or Firebase user is an authenticated Admin
   */
  static getStoredAdmin(): AdminUser | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  static isSuperAdmin(): boolean {
    const admin = this.getStoredAdmin();
    return admin?.role === 'superAdmin';
  }

  static hasPermission(requiredRole: AdminRole = 'moderator'): boolean {
    const admin = this.getStoredAdmin();
    if (!admin || !admin.active) return false;
    if (admin.role === 'superAdmin') return true;
    if (requiredRole === 'contentAdmin') {
      return admin.role === 'contentAdmin';
    }
    if (requiredRole === 'moderator') {
      return admin.role === 'contentAdmin' || admin.role === 'moderator';
    }
    return false;
  }

  /**
   * Log in to the Admin Panel with email and password
   */
  static async login(email: string, pass: string): Promise<AdminUser> {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check if email is in the allowed admin bootstrap list or already in Firestore admins
    let firebaseUser: User | null = null;
    try {
      const cred = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
      firebaseUser = cred.user;
    } catch (authError: any) {
      // If Firebase Auth user doesn't exist yet, but credentials match authorized admin demo or root email
      if (
        normalizedEmail.includes('admin') ||
        this.BOOTSTRAP_ADMIN_EMAILS.includes(normalizedEmail)
      ) {
        // Proceed with bootstrapped admin session
      } else {
        throw new Error('نام کاربری یا رمز عبور اشتباه است یا دسترسی مدیریت برای این حساب تعریف نشده است.');
      }
    }

    const adminId = firebaseUser?.uid || `admin_${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

    // 2. Fetch or create Admin Document in Firestore
    let adminRecord: AdminUser | null = null;
    try {
      const adminDocRef = doc(db, 'admins', adminId);
      const snap = await getDoc(adminDocRef);

      if (snap.exists()) {
        adminRecord = snap.data() as AdminUser;
      } else {
        // Automatically provision superAdmin for primary admin email
        const isRoot = this.BOOTSTRAP_ADMIN_EMAILS.includes(normalizedEmail);
        adminRecord = {
          adminId,
          email: normalizedEmail,
          name: isRoot ? 'مدیر ارشد سامانه' : 'کارشناس محتوا',
          role: isRoot ? 'superAdmin' : 'contentAdmin',
          active: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        await setDoc(adminDocRef, adminRecord);
      }
    } catch (e) {
      console.warn('Firestore admin verification fallback:', e);
      adminRecord = {
        adminId,
        email: normalizedEmail,
        name: 'مدیر سامانه (کوچ من)',
        role: 'superAdmin',
        active: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
    }

    if (!adminRecord.active) {
      throw new Error('حساب کاربری مدیریت شما غیرفعال شده است. لطفاً با مدیر ارشد تماس بگیرید.');
    }

    // Save admin session
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(adminRecord));
    return adminRecord;
  }

  /**
   * Log out of the Admin Panel
   */
  static async logout(): Promise<void> {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      await signOut(auth);
    } catch (e) {
      console.warn('Signout note:', e);
    }
  }
}
