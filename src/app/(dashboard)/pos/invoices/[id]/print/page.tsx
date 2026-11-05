'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Printer, ArrowLeft, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ClinicService, SEED_INVOICES, SEED_SETTINGS } from '@/services/clinic-service';
import { Invoice } from '@/types/database.types';

export default function PrintInvoicePage() {
  const params = useParams();
  const invoiceId = params?.id as string;
  const [invoice, setInvoice] = React.useState<Invoice | null>(null);

  React.useEffect(() => {
    async function load() {
      const inv = await ClinicService.getInvoiceById(invoiceId);
      setInvoice(inv);
    }
    load();
  }, [invoiceId]);

  if (!invoice) {
    return <div className="p-10 text-center text-slate-500">Loading Commercial Invoice...</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="no-print flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <Link href={`/pos/invoices/${invoice.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Invoice
          </Button>
        </Link>
        <Button variant="primary" size="sm" onClick={handlePrint} className="bg-teal-600 hover:bg-teal-700 shadow-sm">
          <Printer className="w-4 h-4 mr-1.5" /> Print Invoice (A4)
        </Button>
      </div>

      {/* A4 Invoice Document */}
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-lg text-slate-900 print:shadow-none print:border-none print:p-4 print:max-w-full">
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-teal-700 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
                {SEED_SETTINGS.clinic_name}
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              {SEED_SETTINGS.address}, {SEED_SETTINGS.city}, Pakistan
            </p>
            <p className="text-xs text-slate-500">
              Tel: {SEED_SETTINGS.phone} • Email: {SEED_SETTINGS.email}
            </p>
            <p className="text-[11px] text-slate-400">
              Tax ID / NTN: NTN-9988231-1 • Reg: {SEED_SETTINGS.registration_no}
            </p>
          </div>

          <div className="text-right space-y-1">
            <div className="text-xl font-black text-teal-800 tracking-wider">COMMERCIAL INVOICE</div>
            <div className="font-mono font-bold text-sm text-slate-800">{invoice.invoice_number}</div>
            <div className="text-xs text-slate-500">Date: {formatDate(invoice.invoice_date)}</div>
            <div className="text-xs font-semibold uppercase text-emerald-700">
              Status: {invoice.payment_status.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Bill To & Attending Doctor */}
        <div className="grid grid-cols-2 gap-8 my-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <div>
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Billed Patient</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{invoice.patient?.full_name}</div>
            <div className="text-slate-600 font-mono mt-0.5">MRN: {invoice.patient?.patient_mrn}</div>
            <div className="text-slate-500">{invoice.patient?.phone}</div>
            <div className="text-slate-500">{invoice.patient?.city || 'Karachi'}</div>
          </div>

          <div className="text-right">
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Medical Provider</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{invoice.doctor?.full_name || 'Al-Shifa Clinical Facility'}</div>
            <div className="text-slate-600">{invoice.doctor?.specialty || 'General Care'}</div>
            <div className="text-slate-500">Cashier: Front Desk Terminal 1</div>
          </div>
        </div>

        {/* Items Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden my-6">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Item & Description</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items?.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{item.item_name}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{item.item_type}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-semibold">{item.quantity}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(item.unit_price)}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    {formatCurrency(item.total_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Summary */}
        <div className="flex justify-end my-6">
          <div className="w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount:</span>
                <span className="font-semibold">-{formatCurrency(invoice.discount_amount)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Sales Tax:</span>
              <span className="font-semibold">{formatCurrency(invoice.tax_amount)}</span>
            </div>
            <div className="pt-2 border-t-2 border-slate-800 flex justify-between font-bold text-sm text-slate-900">
              <span>Grand Total:</span>
              <span className="text-base text-teal-800">{formatCurrency(invoice.total_amount)}</span>
            </div>
            <div className="flex justify-between font-semibold text-emerald-700">
              <span>Amount Paid:</span>
              <span>{formatCurrency(invoice.paid_amount)}</span>
            </div>
            <div className="flex justify-between font-bold text-rose-600 pt-1 border-t border-slate-200">
              <span>Balance Due:</span>
              <span>{formatCurrency(invoice.balance_due)}</span>
            </div>
          </div>
        </div>

        {/* Payments Breakdown */}
        {invoice.payments && invoice.payments.length > 0 && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs my-6 space-y-1.5">
            <span className="font-bold text-slate-700 block uppercase text-[10px] tracking-wider">
              Settlement Tender Breakdown:
            </span>
            <div className="space-y-1">
              {invoice.payments.map((p) => (
                <div key={p.id} className="flex justify-between text-slate-600">
                  <span className="capitalize">
                    {p.payment_method.replace('_', ' ')} {p.reference_number ? `(${p.reference_number})` : ''}
                  </span>
                  <span className="font-semibold text-slate-900">{formatCurrency(p.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Notes */}
        <div className="pt-8 border-t border-slate-200 text-center space-y-2 text-xs text-slate-500">
          <p className="font-medium text-slate-700">
            {SEED_SETTINGS.invoice_footer || 'Thank you for choosing Al-Shifa Premier Clinic.'}
          </p>
          <p className="text-[10px] text-slate-400">
            This is a computer-generated tax invoice. Keep this receipt for your records and medical claim reimbursements.
          </p>
        </div>
      </div>
    </div>
  );
}
