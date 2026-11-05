'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  ChevronRight,
  UserCheck,
  Package,
  Plus,
  ShoppingCart,
  Activity,
  CreditCard,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import {
  ClinicService,
  SEED_APPOINTMENTS,
  SEED_PATIENTS,
  SEED_INVOICES,
  SEED_PRODUCTS,
  SEED_FOLLOWUPS,
} from '@/services/clinic-service';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function DashboardPage() {
  const [dateFilter, setDateFilter] = React.useState('This Month');
  const [stats, setStats] = React.useState({
    totalPatients: 1420,
    newPatientsToday: 4,
    todayAppointments: 18,
    completedAppointments: 12,
    pendingAppointments: 6,
    todayRevenue: 28500,
    monthlyRevenue: 642000,
    outstandingPayments: 18400,
    totalExpenses: 215000,
    estimatedNetIncome: 427000,
  });

  React.useEffect(() => {
    async function load() {
      const data = await ClinicService.getDashboardStats();
      setStats(data);
    }
    load();
  }, []);

  const revenueData = [
    { day: 'Mon', revenue: 42000, expenses: 14000 },
    { day: 'Tue', revenue: 58000, expenses: 12000 },
    { day: 'Wed', revenue: 51000, expenses: 18500 },
    { day: 'Thu', revenue: 64000, expenses: 16000 },
    { day: 'Fri', revenue: 72000, expenses: 22000 },
    { day: 'Sat', revenue: 84000, expenses: 31000 },
    { day: 'Sun', revenue: 38000, expenses: 9000 },
  ];

  const appointmentDistribution = [
    { name: 'Completed', value: 12, color: '#0d9488' },
    { name: 'Checked In', value: 3, color: '#0284c7' },
    { name: 'Scheduled', value: 6, color: '#f59e0b' },
    { name: 'Cancelled', value: 1, color: '#e11d48' },
  ];

  const serviceRevenue = [
    { name: 'Cardiology', amount: 185000 },
    { name: 'General Medicine', amount: 142000 },
    { name: 'Pharmacy Sales', amount: 168000 },
    { name: 'Laboratory & CBC', amount: 89000 },
    { name: 'Pediatrics', amount: 58000 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome & Date Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Clinic Operational Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time analytics for <span className="font-semibold text-slate-700">Al-Shifa Premier Clinic</span> (Karachi, PK)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {['Today', 'Last 7 Days', 'This Month', 'Previous Month'].map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                dateFilter === filter
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
          <Link href="/pos">
            <Button size="sm" variant="primary" className="ml-2">
              <ShoppingCart className="w-3.5 h-3.5 mr-1" />
              Quick POS
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Patients */}
        <Card className="hover:border-teal-300 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Patients</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-slate-900">
                {stats.totalPatients.toLocaleString()}
              </span>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +{stats.newPatientsToday} today
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card className="hover:border-teal-300 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Appointments</span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-slate-900">
                {stats.todayAppointments}
              </span>
              <span className="text-[11px] font-semibold text-teal-700">
                {stats.completedAppointments} completed
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Today's Revenue */}
        <Card className="hover:border-teal-300 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Today&apos;s Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xl sm:text-2xl font-bold text-slate-900">
                {formatCurrency(stats.todayRevenue)}
              </span>
              <div className="text-[10px] text-slate-400 mt-0.5">Verified collections</div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue */}
        <Card className="hover:border-teal-300 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Monthly Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xl sm:text-2xl font-bold text-slate-900">
                {formatCurrency(stats.monthlyRevenue)}
              </span>
              <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                <ArrowUpRight className="w-3 h-3" /> +14.2% vs last month
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Net Income */}
        <Card className="hover:border-teal-300 transition-colors col-span-2 lg:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Est. Net Income</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xl sm:text-2xl font-bold text-teal-700">
                {formatCurrency(stats.estimatedNetIncome)}
              </span>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Expenses: {formatCurrency(stats.totalExpenses)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding & Alerts Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900">Outstanding Invoices Due</div>
            <div className="text-base font-extrabold text-amber-800">
              {formatCurrency(stats.outstandingPayments)}
            </div>
          </div>
          <Link href="/pos/invoices" className="ml-auto">
            <Button size="sm" variant="outline" className="border-amber-300 text-amber-800 bg-white">
              View
            </Button>
          </Link>
        </div>

        <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-900">Stock & Expiry Alert</div>
            <div className="text-xs text-rose-700">1 low-stock item, 0 expiring this month</div>
          </div>
          <Link href="/inventory" className="ml-auto">
            <Button size="sm" variant="outline" className="border-rose-300 text-rose-800 bg-white">
              Inspect
            </Button>
          </Link>
        </div>

        <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-teal-900">Overdue Patient Follow-ups</div>
            <div className="text-xs text-teal-700">2 pending post-consultation reviews</div>
          </div>
          <Link href="/crm/follow-ups" className="ml-auto">
            <Button size="sm" variant="outline" className="border-teal-300 text-teal-800 bg-white">
              Review
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue & Expense Curve */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Financial Inflow vs Outflow</CardTitle>
              <CardDescription>Daily revenue collections compared against operational expenses</CardDescription>
            </div>
            <Badge variant="primary">Weekly Trend</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `₨${v / 1000}k`} />
                  <Tooltip
                    formatter={(value: any) => [formatCurrency(Number(value || 0)), '']}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="#e11d48"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorExp)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Status Donut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Today&apos;s Appointments</CardTitle>
            <CardDescription>Breakdown by consultation queue status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-52 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentDistribution}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {appointmentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
              {appointmentDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 truncate">{item.name}:</span>
                  <span className="font-bold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Queues: Today's Appointments & Recent POS Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments Schedule */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Today&apos;s Patient Queue</CardTitle>
              <CardDescription>Live clinic appointments schedule</CardDescription>
            </div>
            <Link href="/appointments">
              <Button size="sm" variant="ghost" className="text-teal-600 hover:text-teal-700">
                View Calendar <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100 p-0 px-5">
            {SEED_APPOINTMENTS.map((apt) => (
              <div key={apt.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 font-bold text-xs flex flex-col items-center justify-center shrink-0">
                    <span>{apt.start_time.slice(0, 5)}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {apt.patient?.full_name}
                    </div>
                    <div className="text-xs text-slate-500 truncate">
                      {apt.doctor?.full_name} • {apt.reason}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {apt.status === 'in_consultation' && (
                    <Badge variant="primary" className="animate-pulse">In Consultation</Badge>
                  )}
                  {apt.status === 'checked_in' && (
                    <Badge variant="info">Checked In</Badge>
                  )}
                  {apt.status === 'scheduled' && (
                    <Badge variant="warning">Scheduled</Badge>
                  )}
                  {apt.status === 'completed' && (
                    <Badge variant="success">Completed</Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Invoices & POS Transactions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Recent POS Billing</CardTitle>
              <CardDescription>Latest customer receipts and payment settlements</CardDescription>
            </div>
            <Link href="/pos/invoices">
              <Button size="sm" variant="ghost" className="text-teal-600 hover:text-teal-700">
                All Invoices <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100 p-0 px-5">
            {SEED_INVOICES.map((inv) => (
              <div key={inv.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-slate-800">
                      {inv.invoice_number}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-medium text-slate-700 truncate">
                      {inv.patient?.full_name}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {formatDate(inv.invoice_date)} • {inv.items?.length || 1} line items
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-slate-900">
                    {formatCurrency(inv.total_amount)}
                  </div>
                  <div>
                    {inv.payment_status === 'paid' ? (
                      <Badge variant="success" className="text-[10px]">Paid</Badge>
                    ) : inv.payment_status === 'partially_paid' ? (
                      <Badge variant="warning" className="text-[10px]">
                        Due {formatCurrency(inv.balance_due)}
                      </Badge>
                    ) : (
                      <Badge variant="danger" className="text-[10px]">Unpaid</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Lower Row: Revenue By Department & Active CRM Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Revenue Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue by Specialty & Department</CardTitle>
            <CardDescription>Top clinical revenue streams for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceRevenue} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `₨${v / 1000}k`} />
                  <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} width={130} />
                  <Tooltip formatter={(value: any) => [formatCurrency(Number(value || 0)), 'Invoiced']} />
                  <Bar dataKey="amount" fill="#0d9488" radius={[0, 4, 4, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* CRM Follow-ups Widget */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Pending Follow-ups</CardTitle>
              <CardDescription>Care continuity timeline</CardDescription>
            </div>
            <Link href="/crm/follow-ups">
              <Button size="sm" variant="ghost" className="text-teal-600">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100 p-0 px-5">
            {SEED_FOLLOWUPS.map((f) => (
              <div key={f.id} className="py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">
                    {f.patient?.full_name}
                  </span>
                  <Badge variant="warning" className="text-[10px]">
                    {formatDate(f.follow_up_date)}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {f.notes}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-teal-700 font-medium">
                  <span>{f.doctor?.full_name}</span>
                  <Link
                    href={`https://wa.me/${f.patient?.phone?.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(f.patient?.full_name || '')},%20this%20is%20Al-Shifa%20Clinic%20following%20up%20on%20your%20recent%20visit.`}
                    target="_blank"
                    className="hover:underline flex items-center gap-1 text-emerald-700 font-semibold"
                  >
                    WhatsApp &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
