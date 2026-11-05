'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DollarSign, ArrowLeft, CheckCircle2, Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, Textarea } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ExpenseCategory, PaymentMethod } from '@/types/database.types';
import { createClient } from '@/lib/supabase/client';

export default function NewExpensePage() {
  const router = useRouter();
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState<ExpenseCategory>('medical_supplies');
  const [amount, setAmount] = React.useState('');
  const [method, setMethod] = React.useState<PaymentMethod>('cash');
  const [paidTo, setPaidTo] = React.useState('');
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const clinicId = process.env.NEXT_PUBLIC_CLINIC_ID || '11111111-1111-1111-1111-111111111111';
      const expNum = `EXP-2026-${String(Math.floor(Math.random() * 900) + 100)}`;

      if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
        await supabase.from('expenses').insert({
          clinic_id: clinicId,
          expense_number: expNum,
          expense_date: date,
          category,
          description,
          amount: parseFloat(amount) || 0,
          payment_method: method,
          paid_to: paidTo,
          notes,
        });
      }

      router.push('/finance/expenses');
    } catch {
      router.push('/finance/expenses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/finance/expenses">
            <Button size="icon" variant="outline" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Record Operational Expense</h1>
            <p className="text-xs text-slate-500">Log financial expenditure, utility payment, or vendor purchase</p>
          </div>
        </div>

        <Badge variant="primary" className="font-mono text-xs">
          Auto EXP-2026-XXX
        </Badge>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <DollarSign className="w-4 h-4 text-teal-600" /> Voucher Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Expense Title / Description *</label>
              <Input
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Monthly Power Bill, Bandages and Gauze Refill, Clinic Internet"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Category *</label>
                <Select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                >
                  <option value="medical_supplies">Medical Supplies & Consumables</option>
                  <option value="rent">Facility Rent</option>
                  <option value="salaries">Staff Salaries</option>
                  <option value="electricity">Electricity / Power</option>
                  <option value="internet">Internet & Communication</option>
                  <option value="maintenance">Facility Maintenance</option>
                  <option value="equipment">Clinical Equipment</option>
                  <option value="marketing">Marketing & Promotion</option>
                  <option value="other">Other Operating Costs</option>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Amount (PKR) *</label>
                <Input
                  type="number"
                  step="0.01"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 15000"
                  className="font-bold text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Payment Channel *</label>
                <Select
                  value={method}
                  onChange={(e: any) => setMethod(e.target.value)}
                >
                  <option value="cash">Cash Tender</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="card">Corporate Card</option>
                  <option value="jazzcash">JazzCash</option>
                  <option value="easypaisa">EasyPaisa</option>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Paid To (Beneficiary)</label>
                <Input
                  value={paidTo}
                  onChange={(e) => setPaidTo(e.target.value)}
                  placeholder="Company / Vendor Name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Payment Date</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Voucher Remarks</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional details, invoice cross-reference, authorization details..."
                className="min-h-[70px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4 bg-slate-50/50">
            <Link href="/finance/expenses">
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" size="md" isLoading={loading} className="bg-teal-600 hover:bg-teal-700">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Save Expense Voucher
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
