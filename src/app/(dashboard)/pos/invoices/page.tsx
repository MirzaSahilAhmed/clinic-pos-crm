'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Plus,
  Filter,
  Eye,
  Printer,
  DollarSign,
  Download,
  CreditCard,
  ShoppingCart,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ClinicService, SEED_INVOICES } from '@/services/clinic-service';
import { Invoice } from '@/types/database.types';

export default function InvoicesListPage() {
  const [invoices, setInvoices] = React.useState<Invoice[]>(SEED_INVOICES);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');

  React.useEffect(() => {
    async function load() {
      const data = await ClinicService.getInvoices();
      setInvoices(data);
    }
    load();
  }, []);

  const filtered = invoices.filter((inv) => {
    if (statusFilter !== 'all' && inv.payment_status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchNum = inv.invoice_number.toLowerCase().includes(q);
      const matchPatient = inv.patient?.full_name.toLowerCase().includes(q);
      return matchNum || matchPatient;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" />
            Billing & Invoices Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit-safe invoice snapshots, partial balances, and settlement history
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/pos">
            <Button variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700 shadow-sm">
              <ShoppingCart className="w-4 h-4 mr-1.5" /> Open POS Terminal
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
              placeholder="Search by Invoice Number or Patient..."
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-44 bg-slate-50 text-xs"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid in Full</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="unpaid">Unpaid</option>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Doctor</th>
                <th className="py-3.5 px-4 text-right">Total Amount</th>
                <th className="py-3.5 px-4 text-right">Amount Paid</th>
                <th className="py-3.5 px-4 text-right">Balance Due</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">
                    <Link href={`/pos/invoices/${inv.id}`} className="hover:underline">
                      {inv.invoice_number}
                    </Link>
                  </td>

                  <td className="py-3 px-4">
                    <Link href={`/patients/${inv.patient?.id}`} className="font-semibold text-slate-900 hover:text-teal-700">
                      {inv.patient?.full_name}
                    </Link>
                    <div className="text-[10px] text-slate-400 font-mono">{inv.patient?.patient_mrn}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {formatDate(inv.invoice_date)}
                  </td>

                  <td className="py-3 px-4 text-slate-700">
                    {inv.doctor?.full_name || 'General Clinic'}
                  </td>

                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    {formatCurrency(inv.total_amount)}
                  </td>

                  <td className="py-3 px-4 text-right font-semibold text-emerald-700">
                    {formatCurrency(inv.paid_amount)}
                  </td>

                  <td className="py-3 px-4 text-right">
                    {inv.balance_due > 0 ? (
                      <span className="font-bold text-rose-600">{formatCurrency(inv.balance_due)}</span>
                    ) : (
                      <span className="text-slate-400">₨0</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <Badge
                      variant={
                        inv.payment_status === 'paid'
                          ? 'success'
                          : inv.payment_status === 'partially_paid'
                          ? 'warning'
                          : 'danger'
                      }
                      className="capitalize text-[10px]"
                    >
                      {inv.payment_status.replace('_', ' ')}
                    </Badge>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/pos/invoices/${inv.id}`}>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-600 hover:text-teal-700" title="View Invoice">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Link href={`/pos/invoices/${inv.id}/print`}>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-600 hover:text-teal-700" title="Print Invoice">
                          <Printer className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
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
