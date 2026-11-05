'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  FileText,
  Printer,
  ArrowLeft,
  DollarSign,
  Plus,
  CheckCircle2,
  Calendar,
  User,
  CreditCard,
  Building2,
  Sparkles,
  Receipt,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ClinicService, SEED_INVOICES, SEED_SETTINGS } from '@/services/clinic-service';
import { Invoice, PaymentMethod } from '@/types/database.types';

export default function InvoiceDetailsPage() {
  const params = useParams();
  const invoiceId = params?.id as string;
  const [invoice, setInvoice] = React.useState<Invoice | null>(null);

  // Additional Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [payAmount, setPayAmount] = React.useState<number>(0);
  const [payMethod, setPayMethod] = React.useState<PaymentMethod>('cash');
  const [payRef, setPayRef] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      const inv = await ClinicService.getInvoiceById(invoiceId);
      setInvoice(inv);
      if (inv) setPayAmount(inv.balance_due);
    }
    load();
  }, [invoiceId]);

  if (!invoice) {
    return <div className="p-10 text-center text-slate-500">Loading Invoice Record...</div>;
  }

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newPayment = {
      id: 'pay-new-' + Date.now(),
      clinic_id: invoice.clinic_id,
      payment_number: `PAY-2026-${String(Math.floor(Math.random() * 90000) + 10000)}`,
      invoice_id: invoice.id,
      patient_id: invoice.patient_id,
      payment_date: new Date().toISOString(),
      amount: payAmount,
      payment_method: payMethod,
      reference_number: payRef || null,
      notes: 'Additional payment settlement',
      is_reversed: false,
      created_at: new Date().toISOString(),
    };

    const newPaid = invoice.paid_amount + payAmount;
    const newBalance = Math.max(0, invoice.total_amount - newPaid);

    setInvoice((prev) =>
      prev
        ? {
            ...prev,
            paid_amount: newPaid,
            balance_due: newBalance,
            payment_status: newBalance === 0 ? 'paid' : 'partially_paid',
            payments: [...(prev.payments || []), newPayment],
          }
        : null
    );

    setLoading(false);
    setShowPaymentModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/pos/invoices">
            <Button size="icon" variant="outline" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight font-mono">
                {invoice.invoice_number}
              </h1>
              <Badge
                variant={
                  invoice.payment_status === 'paid'
                    ? 'success'
                    : invoice.payment_status === 'partially_paid'
                    ? 'warning'
                    : 'danger'
                }
                className="capitalize"
              >
                {invoice.payment_status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Issued on {formatDate(invoice.invoice_date)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {invoice.balance_due > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowPaymentModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <DollarSign className="w-4 h-4 mr-1" /> Settle Balance ({formatCurrency(invoice.balance_due)})
            </Button>
          )}
          <Link href={`/pos/invoices/${invoice.id}/print`}>
            <Button variant="outline" size="sm" className="border-slate-300">
              <Printer className="w-4 h-4 mr-1 text-slate-600" /> Print A4
            </Button>
          </Link>
        </div>
      </div>

      {/* Invoice Overview Card */}
      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block">Billed To</span>
              <span className="font-bold text-slate-900 text-sm">{invoice.patient?.full_name}</span>
              <span className="text-slate-400 block font-mono text-[10px]">{invoice.patient?.patient_mrn}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Attending Doctor</span>
              <span className="font-semibold text-slate-800">{invoice.doctor?.full_name || 'Clinic Service'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Total Due</span>
              <span className="font-bold text-slate-900 text-sm">{formatCurrency(invoice.total_amount)}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Current Balance</span>
              <span className={`font-bold text-sm ${invoice.balance_due > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {invoice.balance_due > 0 ? formatCurrency(invoice.balance_due) : 'Cleared'}
              </span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Line Items Billed</h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4">Item & Description</th>
                    <th className="py-2.5 px-4 text-center">Type</th>
                    <th className="py-2.5 px-4 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Unit Price</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.items?.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{item.item_name}</td>
                      <td className="py-2.5 px-4 text-center">
                        <Badge variant="outline" className="text-[10px] capitalize">{item.item_type}</Badge>
                      </td>
                      <td className="py-2.5 px-4 text-center font-medium">{item.quantity}</td>
                      <td className="py-2.5 px-4 text-right">{formatCurrency(item.unit_price)}</td>
                      <td className="py-2.5 px-4 text-right font-bold text-slate-900">
                        {formatCurrency(item.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end">
            <div className="w-72 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount Applied</span>
                  <span>-{formatCurrency(invoice.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Tax</span>
                <span>{formatCurrency(invoice.tax_amount)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                <span>Grand Total</span>
                <span>{formatCurrency(invoice.total_amount)}</span>
              </div>
              <div className="flex justify-between font-semibold text-emerald-700 pt-1">
                <span>Total Collected</span>
                <span>{formatCurrency(invoice.paid_amount)}</span>
              </div>
              <div className="flex justify-between font-bold text-rose-600 pt-1 border-t border-slate-200">
                <span>Balance Due</span>
                <span>{formatCurrency(invoice.balance_due)}</span>
              </div>
            </div>
          </div>

          {/* Payment Transactions Log */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Payment Transactions Log</h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              {invoice.payments?.map((pay) => (
                <div key={pay.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 capitalize">
                        {pay.payment_method.replace('_', ' ')} • <span className="font-mono font-normal text-slate-500">{pay.payment_number}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {formatDate(pay.payment_date)} {pay.reference_number ? `• Ref: ${pay.reference_number}` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">
                    {formatCurrency(pay.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Record Additional Payment Modal */}
      {showPaymentModal && (
        <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
          <DialogHeader>
            <DialogTitle>Record Payment for {invoice.invoice_number}</DialogTitle>
            <DialogClose onClose={() => setShowPaymentModal(false)} />
          </DialogHeader>
          <form onSubmit={handleRecordPayment}>
            <DialogContent className="space-y-4 text-xs">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900">
                Remaining outstanding balance: <span className="font-bold">{formatCurrency(invoice.balance_due)}</span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Settlement Amount (PKR) *</label>
                <Input
                  type="number"
                  min="1"
                  max={invoice.balance_due}
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(parseFloat(e.target.value) || 0)}
                  className="font-bold text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Payment Channel *</label>
                <Select
                  value={payMethod}
                  onChange={(e: any) => setPayMethod(e.target.value)}
                >
                  <option value="cash">Cash</option>
                  <option value="card">Debit/Credit Card</option>
                  <option value="jazzcash">JazzCash</option>
                  <option value="easypaisa">EasyPaisa</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Transaction Reference #</label>
                <Input
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="e.g. Card Auth code, JazzCash TID"
                />
              </div>
            </DialogContent>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={loading} className="bg-teal-600 hover:bg-teal-700">
                Confirm & Record Settlement
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      )}
    </div>
  );
}
