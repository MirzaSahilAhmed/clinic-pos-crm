'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  CreditCard,
  Building2,
  Calendar,
  Download,
  TrendingDown,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ClinicService, SEED_EXPENSES } from '@/services/clinic-service';
import { Expense } from '@/types/database.types';

export default function ExpensesListPage() {
  const [expenses, setExpenses] = React.useState<Expense[]>(SEED_EXPENSES);
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    async function load() {
      const data = await ClinicService.getExpenses();
      setExpenses(data);
    }
    load();
  }, []);

  const filtered = expenses.filter((e) => {
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        e.description.toLowerCase().includes(q) ||
        (e.paid_to && e.paid_to.toLowerCase().includes(q)) ||
        e.expense_number.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalExpenseAmount = filtered.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-teal-600" />
            Operational Expenses & Disbursements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Rent, utilities, clinical supplies, maintenance, and administrative payments
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl text-right">
            <span className="text-[10px] text-rose-800 font-bold uppercase tracking-wider block">Total Disbursements</span>
            <span className="text-lg font-black text-rose-700">{formatCurrency(totalExpenseAmount)}</span>
          </div>

          <Link href="/finance/expenses/new">
            <Button variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700 shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" /> Record Expense
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search expenses by description or payee..."
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>

          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-48 bg-slate-50 text-xs"
          >
            <option value="all">All Expense Categories</option>
            <option value="rent">Facility Rent</option>
            <option value="electricity">Electricity & Utilities</option>
            <option value="medical_supplies">Medical Supplies</option>
            <option value="internet">Internet & Telecom</option>
            <option value="salaries">Staff Salaries</option>
            <option value="maintenance">Maintenance</option>
            <option value="marketing">Marketing</option>
            <option value="other">Other</option>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Voucher #</th>
                <th className="py-3.5 px-4">Expense Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Paid To</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4 text-right">Amount (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{e.expense_number}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{e.description}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="capitalize text-[10px]">
                      {e.category.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{e.paid_to || '-'}</td>
                  <td className="py-3 px-4 text-slate-500">{formatDate(e.expense_date)}</td>
                  <td className="py-3 px-4 capitalize text-slate-700 font-medium">
                    {e.payment_method.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-rose-600 text-sm">
                    {formatCurrency(e.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
