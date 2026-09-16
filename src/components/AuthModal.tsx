import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, LogIn, UserPlus, Sparkles, KeyRound } from 'lucide-react';
import { AuthRepository } from '../repositories/AuthRepository';
import { toPersianDigits } from '../utils/persian';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (userName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (isResetPassword) {
        if (!email) throw new Error('لطفاً ایمیل خود را وارد کنید.');
        await AuthRepository.resetPassword(email);
        setSuccessMessage('لینک بازیابی رمز عبور به ایمیل شما ارسال شد.');
      } else if (isRegister) {
        if (!name || !email || !password) throw new Error('لطفاً تمام فیلدها را تکمیل فرمایید.');
        if (password.length < 6) throw new Error('رمز عبور باید حداقل ۶ کاراکتر باشد.');
        const profile = await AuthRepository.registerWithEmail(email, password, name);
        onAuthSuccess(profile.name);
        onClose();
      } else {
        if (!email || !password) throw new Error('لطفاً ایمیل و رمز عبور را وارد کنید.');
        const user = await AuthRepository.loginWithEmail(email, password);
        onAuthSuccess(user.displayName || email.split('@')[0]);
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'خطایی در برقراری ارتباط رخ داد.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        msg = 'ایمیل یا رمز عبور اشتباه است.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'این ایمیل قبلاً ثبت نام شده است.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'فرمت آدرس ایمیل نامعتبر است.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const user = await AuthRepository.loginWithGoogle();
      onAuthSuccess(user.displayName || 'ورزشکار');
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMessage('ورود با حساب گوگل با خطا مواجه شد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#0c0c0c] border border-white/10 rounded-[36px] p-6 sm:p-8 shadow-2xl z-10 text-right backdrop-blur-2xl"
          dir="rtl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 left-6 p-2 rounded-2xl bg-white/[0.05] text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4">
              {isResetPassword ? <KeyRound className="w-6 h-6" /> : isRegister ? <UserPlus className="w-6 h-6" /> : <LogIn className="w-6 h-6" />}
            </div>
            <h3 className="text-2xl font-black text-white">
              {isResetPassword ? 'بازیابی رمز عبور' : isRegister ? 'ایجاد حساب کاربری' : 'ورود به حساب کاربری'}
            </h3>
            <p className="text-xs text-zinc-400 mt-1.5 font-medium">
              {isResetPassword
                ? 'ایمیل خود را وارد کنید تا لینک بازیابی ارسال شود.'
                : 'برای ذخیره ابری پیشرفت تمرین، رکوردها و همگام‌سازی بین دستگاه‌ها وارد شوید.'}
            </p>
          </div>

          {/* Alert Messages */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              {successMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && !isResetPassword && (
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">نام و نام خانوادگی</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: علیرضا محمدی"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3.5 pl-10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-orange-500"
                  />
                  <UserIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 top-4" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">ایمیل</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.com"
                  dir="ltr"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3.5 pl-10 text-white placeholder-zinc-500 text-sm text-left focus:outline-none focus:border-orange-500"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-4" />
              </div>
            </div>

            {!isResetPassword && (
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">رمز عبور</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3.5 pl-10 text-white placeholder-zinc-500 text-sm text-left focus:outline-none focus:border-orange-500"
                  />
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-4" />
                </div>
              </div>
            )}

            {!isResetPassword && !isRegister && (
              <div className="text-left">
                <button
                  type="button"
                  onClick={() => setIsResetPassword(true)}
                  className="text-xs text-orange-400 hover:underline cursor-pointer"
                >
                  فراموشی رمز عبور؟
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-[0_10px_25px_rgba(234,88,12,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              {loading
                ? 'در حال پردازش...'
                : isResetPassword
                ? 'ارسال ایمیل بازیابی'
                : isRegister
                ? 'ثبت نام و شروع'
                : 'ورود به حساب'}
            </button>
          </form>

          {/* Social Auth */}
          {!isResetPassword && (
            <div className="mt-5 pt-5 border-t border-white/5 space-y-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-zinc-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>🌐</span>
                <span>ورود با حساب گوگل (Google)</span>
              </button>
            </div>
          )}

          {/* Switch Register/Login */}
          <div className="mt-6 text-center text-xs text-zinc-400">
            {isResetPassword ? (
              <button
                type="button"
                onClick={() => setIsResetPassword(false)}
                className="text-orange-400 font-bold hover:underline cursor-pointer"
              >
                بازگشت به صفحه ورود
              </button>
            ) : isRegister ? (
              <span>
                قبلاً ثبت نام کرده‌اید؟{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="text-orange-400 font-bold hover:underline cursor-pointer"
                >
                  وارد شوید
                </button>
              </span>
            ) : (
              <span>
                حساب کاربری ندارید؟{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="text-orange-400 font-bold hover:underline cursor-pointer"
                >
                  ثبت نام رایگان
                </button>
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
