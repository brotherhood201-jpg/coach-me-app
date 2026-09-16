import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { AdminAuthService } from '../../services/AdminAuthService';
import { AdminUser } from '../../types';

interface AdminLoginPageProps {
  onLoginSuccess: (admin: AdminUser) => void;
  onBackToApp: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToApp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('لطفاً ایمیل و رمز عبور را وارد نمایید.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const admin = await AdminAuthService.login(email, password);
      onLoginSuccess(admin);
    } catch (err: any) {
      setError(err.message || 'خطا در ورود به پنل مدیریت.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('admin@poladfitness.ir');
    setPassword('Admin@123456');
    setLoading(true);
    setError(null);
    try {
      const admin = await AdminAuthService.login('admin@poladfitness.ir', 'Admin@123456');
      onLoginSuccess(admin);
    } catch (err: any) {
      setError(err.message || 'خطا در ورود سریع.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4 sm:p-6 text-right selection:bg-emerald-500 selection:text-black" dir="rtl">
      {/* Background Accent glow */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl z-10"
      >
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 mb-4 flex items-center justify-center">
            <div className="w-full h-full bg-zinc-900 rounded-[14px] flex items-center justify-center">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">پنل مدیریت کوچ من</h1>
          <p className="text-sm text-zinc-400 mt-1">سامانه اختصاصی مدیریت محتوا و کاربران بدنسازی</p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-2">ایمیل سازمانی مدیر</label>
            <div className="relative flex items-center">
              <Mail className="absolute right-4 w-5 h-5 text-zinc-500 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@poladfitness.ir"
                dir="ltr"
                className="w-full pl-4 pr-12 py-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-2">رمز عبور امنیتی</label>
            <div className="relative flex items-center">
              <Lock className="absolute right-4 w-5 h-5 text-zinc-500 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full pl-12 pr-12 py-3.5 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 text-zinc-500 hover:text-zinc-300 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm rounded-2xl transition shadow-lg shadow-emerald-500/20 active:scale-[0.99] flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                <span>در حال احراز هویت...</span>
              </>
            ) : (
              <span>ورود به پنل مدیریت</span>
            )}
          </button>
        </form>

        {/* Quick Demo Access button */}
        <div className="mt-6 pt-6 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl border border-zinc-800 hover:border-zinc-700 bg-zinc-950/60 hover:bg-zinc-800/40 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>ورود سریع با دسترسی پیش‌فرض مدیر (SuperAdmin)</span>
          </button>
        </div>

        {/* Back to Mobile App Link */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={onBackToApp}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition mt-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>بازگشت به پیش‌نمایش اپلیکیشن کاربر</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
