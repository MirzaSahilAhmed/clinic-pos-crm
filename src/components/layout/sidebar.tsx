'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  ShoppingCart,
  Boxes,
  HeartHandshake,
  DollarSign,
  Settings,
  ChevronDown,
  ChevronRight,
  UserPlus,
  CalendarPlus,
  Receipt,
  FileText,
  Pill,
  Truck,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  Layers,
  Sparkles,
  ClipboardList,
} from 'lucide-react';

interface NavItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  subItems?: { title: string; href: string; badge?: string }[];
}

export function Sidebar({
  isMobileOpen = false,
  onCloseMobile,
}: {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    Patients: true,
    Appointments: true,
    Clinical: true,
    'POS & Billing': true,
    Inventory: false,
    CRM: false,
    Finance: false,
    Management: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const navGroups: { label: string; items: NavItem[] }[] = [
    {
      label: 'MAIN',
      items: [
        {
          title: 'Dashboard',
          href: '/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: 'PATIENT CARE',
      items: [
        {
          title: 'Patients',
          icon: Users,
          subItems: [
            { title: 'All Patients', href: '/patients' },
            { title: 'Add Patient', href: '/patients/new' },
            { title: 'Patient Follow-ups', href: '/crm/follow-ups' },
          ],
        },
        {
          title: 'Appointments',
          icon: Calendar,
          subItems: [
            { title: 'Calendar View', href: '/appointments' },
            { title: 'New Appointment', href: '/appointments/new' },
          ],
        },
        {
          title: 'Clinical',
          icon: Stethoscope,
          subItems: [
            { title: 'Consultations', href: '/clinical/consultations' },
            { title: 'Medical Records', href: '/clinical/medical-records' },
            { title: 'Prescriptions', href: '/clinical/prescriptions' },
          ],
        },
      ],
    },
    {
      label: 'COMMERCE & OPERATIONS',
      items: [
        {
          title: 'POS & Billing',
          icon: ShoppingCart,
          subItems: [
            { title: 'New Sale (POS)', href: '/pos' },
            { title: 'Invoices', href: '/pos/invoices' },
            { title: 'Payments Log', href: '/pos/payments' },
          ],
        },
        {
          title: 'Inventory',
          icon: Boxes,
          subItems: [
            { title: 'Products & Stock', href: '/inventory' },
            { title: 'Batches & Expiry', href: '/inventory/batches' },
            { title: 'Suppliers', href: '/inventory/suppliers' },
            { title: 'Purchases (PO)', href: '/inventory/purchases' },
          ],
        },
        {
          title: 'CRM & Pipeline',
          icon: HeartHandshake,
          subItems: [
            { title: 'Leads Pipeline', href: '/crm/leads' },
            { title: 'Follow-ups', href: '/crm/follow-ups' },
            { title: 'Communications', href: '/crm/communications' },
          ],
        },
        {
          title: 'Finance',
          icon: DollarSign,
          subItems: [
            { title: 'Expenses', href: '/finance/expenses' },
            { title: 'Financial Reports', href: '/finance/reports' },
          ],
        },
      ],
    },
    {
      label: 'ADMINISTRATION',
      items: [
        {
          title: 'Management',
          icon: Settings,
          subItems: [
            { title: 'Doctors', href: '/management/doctors' },
            { title: 'Staff & Roles', href: '/management/staff' },
            { title: 'Services & Pricing', href: '/management/services' },
            { title: 'Audit Logs', href: '/management/audit-logs' },
            { title: 'Clinic Settings', href: '/management/settings' },
          ],
        },
      ],
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-300 w-64 select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-wide text-white leading-tight">
              AL-SHIFA
            </div>
            <div className="text-[10px] tracking-wider text-teal-400 font-semibold uppercase">
              Clinic POS + CRM
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <p className="px-3 text-[11px] font-bold text-slate-500 tracking-wider">
              {group.label}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const hasSub = item.subItems && item.subItems.length > 0;
              const isOpen = openSections[item.title];
              const isDirectActive = item.href === pathname;
              const isChildActive = item.subItems?.some((sub) => sub.href === pathname);

              if (!hasSub) {
                return (
                  <Link
                    key={item.title}
                    href={item.href || '#'}
                    onClick={onCloseMobile}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isDirectActive
                        ? 'bg-teal-600/90 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-teal-500/20 text-teal-300 rounded">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              }

              return (
                <div key={item.title} className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => toggleSection(item.title)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left cursor-pointer',
                      isChildActive
                        ? 'text-teal-400 bg-slate-800/50'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{item.title}</span>
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="pl-9 pr-1 py-1 space-y-0.5 border-l border-slate-800/80 ml-4">
                      {item.subItems?.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            onClick={onCloseMobile}
                            className={cn(
                              'block px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                              isSubActive
                                ? 'bg-teal-600 text-white font-semibold shadow-xs'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            )}
                          >
                            {sub.title}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Profile Status */}
      <div className="p-3 border-t border-slate-800 shrink-0 bg-slate-950/40">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs ring-2 ring-teal-500/30">
            TM
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-white truncate">Dr. Tariq Mahmood</div>
            <div className="text-[10px] text-teal-400 truncate">Super Admin • Clifton, Karachi</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Online" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0 border-r border-slate-800">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative z-50 flex h-full">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
