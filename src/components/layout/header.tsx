'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Search,
  Bell,
  Plus,
  ShoppingCart,
  UserPlus,
  CalendarPlus,
  Building2,
  CheckCircle2,
  LogOut,
  User,
  Sliders,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Header({ onOpenMobile }: { onOpenMobile: () => void }) {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const notifications = [
    { id: 1, title: 'Low Stock Alert', desc: 'Augmentin 625mg has only 12 tablets remaining.', time: '10m ago', unread: true },
    { id: 2, title: 'Appointment Checked In', desc: 'Muhammad Farooq checked in for Dr. Tariq.', time: '25m ago', unread: true },
    { id: 3, title: 'New CRM Lead', desc: 'Kamran Sheikh requested cardiac checkup package.', time: '1h ago', unread: false },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/patients?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile Toggle & Clinic Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200">
          <Building2 className="w-3.5 h-3.5 text-teal-600" />
          <span className="font-semibold text-slate-800">Al-Shifa Premier Clinic</span>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-700 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Open (PKR)
          </span>
        </div>
      </div>

      {/* Middle: Global Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <form onSubmit={handleSearch} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patients by name, MRN, or phone (e.g. 0300...)"
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
          />
        </form>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Actions */}
        <Link href="/pos">
          <Button variant="primary" size="sm" className="hidden sm:inline-flex bg-teal-600 hover:bg-teal-700 shadow-xs">
            <ShoppingCart className="w-4 h-4" />
            <span>POS Sale</span>
          </Button>
        </Link>

        <Link href="/patients/new">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex border-slate-200">
            <UserPlus className="w-4 h-4 text-teal-600" />
            <span>Patient</span>
          </Button>
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900">Notifications</span>
                <span className="text-[10px] text-teal-600 font-semibold cursor-pointer hover:underline">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-800">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-900 leading-none">Dr. Tariq M.</div>
              <div className="text-[10px] text-teal-600 font-medium">Super Admin</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs">
              TM
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="font-semibold text-xs text-slate-900">Dr. Tariq Mahmood</div>
                <div className="text-[11px] text-slate-500">dr.tariq@alshifaclinic.pk</div>
              </div>
              <Link
                href="/management/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Sliders className="w-4 h-4 text-slate-400" />
                Clinic Settings
              </Link>
              <Link
                href="/management/audit-logs"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                Audit Logs
              </Link>
              <div className="border-t border-slate-100 my-1" />
              <Link
                href="/login"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
