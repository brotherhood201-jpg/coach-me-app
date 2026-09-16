import React, { useState } from 'react';
import {
  Clock,
  Search,
  Filter,
  Shield,
  User,
  Database,
  ArrowUpDown,
  FileSpreadsheet,
} from 'lucide-react';
import { motion } from 'motion/react';
import { AuditLog } from '../../types';

interface AdminAuditLogProps {
  logs: AuditLog[];
}

export const AdminAuditLog: React.FC<AdminAuditLogProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.entityName && log.entityName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchType = typeFilter === 'all' || log.entityType === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Clock className="w-7 h-7 text-purple-400" />
            ثبت رویدادها و ردپای امنیتی (Audit Logs & Security Trail)
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            ثبت غیرقابل دستکاری تمامی عملیات ایجاد، ویرایش و حذف محتوا توسط مدیران سامانه
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="جستجوی عملیات، نام ایمیل مدیر یا نام موجودیت..."
            className="w-full pl-4 pr-12 py-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-white text-sm focus:border-purple-500 focus:outline-none"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs rounded-2xl px-4 py-3 focus:border-purple-500 w-full md:w-auto"
        >
          <option value="all">همه موجودیت‌ها</option>
          <option value="exercise">حرکات ورزشی (exercise)</option>
          <option value="program">برنامه‌ها (program)</option>
          <option value="article">مقالات (article)</option>
          <option value="video">ویدیوها (video)</option>
          <option value="user">کاربران (user)</option>
          <option value="notification">اعلان‌ها (notification)</option>
          <option value="setting">تنظیمات (setting)</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-zinc-950/80 text-zinc-400 text-xs font-bold border-b border-zinc-800">
              <tr>
                <th className="py-4 px-6">شرح رویداد</th>
                <th className="py-4 px-4">موجودیت مرتبط</th>
                <th className="py-4 px-4">مدیر انجام‌دهنده</th>
                <th className="py-4 px-6 text-left">زمان دقیق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-zinc-500 text-sm">
                    هیچ لاگی مطابق فیلتر یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-800/40 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
                        <div>
                          <div className="font-bold text-white text-sm">{log.action}</div>
                          {log.entityName && (
                            <div className="text-xs text-zinc-400 mt-0.5">آیتم: {log.entityName}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono">
                        {log.entityType}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-xs text-zinc-300 font-mono" dir="ltr">{log.adminEmail}</div>
                    </td>
                    <td className="py-4 px-6 text-left font-mono text-xs text-zinc-400">
                      {new Date(log.timestamp).toLocaleString('fa-IR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
