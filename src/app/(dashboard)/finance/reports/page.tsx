'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  PieChart as PieIcon,
  CreditCard,
  Building2,
  FileText,
  Activity,
  ArrowUpRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
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
  Legend,
} from 'recharts';

export default function FinancialReportsPage() {
  const [period, setPeriod] = React.useState('This Month');

  const summary = {
    invoicedSales: 642000,
    paymentsCollected: 623600,
    outstandingBalances: 18400,
    totalExpenses: 215000,
    estimatedNetIncome: 408600,
  };

  const monthlyComparison = [
    { month: 'Jun', invoiced: 480000, collected: 460000, expenses: 180000 },
    { month: 'Jul', invoiced: 520000, collected: 505000, expenses: 195000 },
    { month: 'Aug', invoiced: 560000, collected: 540000, expenses: 190000 },
    { month: 'Sep', invoiced: 590000, collected: 575000, expenses: 205000 },
    { month: 'Oct', invoiced: 615000, collected: 600000, expenses: 210000 },
    { month: 'Nov (MTD)', invoiced: 642000, collected: 623600, expenses: 215000 },
  ];

  const revenueByDoctor = [
    { doctor: 'Dr. Tariq (Cardiology)', revenue: 260000, consultations: 86 },
    { doctor: 'Dr. Ayesha (Pediatrics)', revenue: 195000, consultations: 78 },
    { doctor: 'Dr. Bilal (General Med)', revenue: 187000, consultations: 124 },
  ];

  const paymentTenderDistribution = [
    { name: 'Cash', value: 310000, color: '#0d9488' },
    { name: 'Card Terminal', value: 180000, color: '#0284c7' },
    { name: 'JazzCash', value: 85000, color: '#f59e0b' },
    { name: 'EasyPaisa', value: 32000, color: '#10b981' },
    { name: 'Bank Transfer', value: 16600, color: '#6366f1' },
  ];

  const handleExportCSV = () => {
    const headers = ['Month', 'Invoiced Sales (PKR)', 'Payments Collected (PKR)', 'Expenses (PKR)', 'Net Operating Income (PKR)'];
    const rows = monthlyComparison.map((m) => [
      m.month,
      m.invoiced,
      m.collected,
      m.expenses,
      m.collected - m.expenses,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Financial_Report_AlShifa_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-teal-600" />
            Financial Intelligence & Commercial Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Accrual vs Cash collections, gross margin analysis, and doctor revenue distribution
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="border-slate-300">
            <Download className="w-4 h-4 mr-1 text-slate-600" /> Export CSV Report
          </Button>
        </div>
      </div>

      {/* Primary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <Card className="bg-white">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Invoiced Sales (Accrual)</span>
            <div className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(summary.invoicedSales)}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Total billed services</div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Cash Collections (Realized)</span>
            <div className="text-xl font-bold text-emerald-700 mt-1">{formatCurrency(summary.paymentsCollected)}</div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">97.1% collection rate</div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Outstanding Balances</span>
            <div className="text-xl font-bold text-rose-600 mt-1">{formatCurrency(summary.outstandingBalances)}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Pending collection</div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Total Operating Expenses</span>
            <div className="text-xl font-bold text-slate-800 mt-1">{formatCurrency(summary.totalExpenses)}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Rent, power, supplies</div>
          </CardContent>
        </Card>

        <Card className="bg-white col-span-2 md:col-span-1">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-teal-800 block uppercase">Estimated Net Income</span>
            <div className="text-xl font-extrabold text-teal-700 mt-1">{formatCurrency(summary.estimatedNetIncome)}</div>
            <div className="text-[10px] text-teal-700 font-semibold mt-0.5">Operating Profit (Realized)</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart: Invoiced vs Realized Collections */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Invoiced Sales vs Realized Cash Collections</CardTitle>
            <CardDescription>Visual comparison ensuring clear distinction between invoiced receivables and actual receipts</CardDescription>
          </div>
          <Badge variant="primary">Trailing 6 Months</Badge>
        </CardHeader>
        <CardContent>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparison} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} tickFormatter={(v) => `₨${v / 1000}k`} />
                <Tooltip formatter={(value: any) => [formatCurrency(Number(value || 0)), '']} />
                <Legend />
                <Bar dataKey="invoiced" name="Invoiced Sales" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="collected" name="Realized Collections" fill="#0d9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Operating Expenses" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Analytics: Doctor Revenue & Tender Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Doctor */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Doctor Revenue Contribution</CardTitle>
            <CardDescription>Clinical billings per attending consultant</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {revenueByDoctor.map((d, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{d.doctor}</span>
                  <span className="text-teal-700">{formatCurrency(d.revenue)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-teal-600 h-2 rounded-full"
                    style={{ width: `${(d.revenue / 260000) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400">
                  {d.consultations} patients consulted this period
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payment Methods Distribution */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Payment Tender Breakdown</CardTitle>
            <CardDescription>Collections distribution across payment channels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentTenderDistribution}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {paymentTenderDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [formatCurrency(Number(value || 0)), 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
              {paymentTenderDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600 truncate">{item.name}:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
