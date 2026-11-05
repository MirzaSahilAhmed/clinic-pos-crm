'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CreditCard,
  Search,
  Filter,
  DollarSign,
  Download,
  Calendar,
  User,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/utils';
import { SEED_INVOICES } from '@/services/clinic-service';

export default function PaymentsLogPage() {
  const [methodFilter, setMethodFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');

  const allPayments = SEED_INVOICES.flatMap((inv) =>
    (inv.payments || []).map((p) => ({
      ...p,
      invoice_number: inv.invoice_number,
      patient_name: inv.patient?.full_name || 'Patient',
      patient_mrn: inv.patient?.patient_mrn || '-',
    }))
  );

  const filtered = allPayments.filter((p) => {
    if (methodFilter !== 'all' && p.payment_method !== methodFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.payment_number.toLowerCase().includes(q) ||
        p.invoice_number.toLowerCase().includes(q) ||
        p.patient_name.toLowerCase().includes(q) ||
        (p.reference_number && p.reference_number.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const totalCollected = filtered.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-teal-600" />
            Payment Collections & Tender Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit trail of cash, card, JazzCash, EasyPaisa, and bank transfer receipts
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-right">
          <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">Filtered Collections</span>
          <span className="text-lg font-black text-emerald-700">{formatCurrency(totalCollected)}</span>
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
              placeholder="Search by Payment #, Invoice #, or Patient Name..."
              className="pl-9 bg-slate-50 border-slate-200 text-xs"
            />
          </div>

          <Select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="w-48 bg-slate-50 text-xs"
          >
            <option value="all">All Payment Channels</option>
            <option value="cash">Cash Tender</option>
            <option value="card">Debit / Credit Card</option>
            <option value="jazzcash">JazzCash</option>
            <option value="easypaisa">EasyPaisa</option>
            <option value="bank_transfer">Bank Transfer</option>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Reference / TID</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4 text-right">Amount Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    {pay.payment_number}
                  </td>
                  <td className="py-3 px-4 font-mono text-teal-700">
                    <Link href={`/pos/invoices/${pay.invoice_id}`} className="hover:underline">
                      {pay.invoice_number}
                    </Link>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900">{pay.patient_name}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">{pay.patient_mrn}</span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="primary" className="capitalize text-[10px]">
                      {pay.payment_method.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {pay.reference_number || '-'}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {formatDate(pay.payment_date)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 text-sm">
                    {formatCurrency(pay.amount)}
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
