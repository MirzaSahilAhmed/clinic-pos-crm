'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Printer, ArrowLeft, Building2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { ClinicService, SEED_PRESCRIPTIONS, SEED_SETTINGS } from '@/services/clinic-service';
import { Prescription } from '@/types/database.types';

export default function PrintPrescriptionPage() {
  const params = useParams();
  const rxId = params?.id as string;
  const [prescription, setPrescription] = React.useState<Prescription | null>(null);

  React.useEffect(() => {
    async function load() {
      const all = await ClinicService.getPrescriptions();
      const found = all.find((p) => p.id === rxId) || all[0];
      setPrescription(found);
    }
    load();
  }, [rxId]);

  if (!prescription) {
    return <div className="p-10 text-center text-slate-500">Loading Prescription Document...</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Bar for Actions (Hidden in Print) */}
      <div className="no-print flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <Link href="/clinical/prescriptions">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Prescriptions
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={handlePrint} className="bg-teal-600 hover:bg-teal-700 shadow-sm">
            <Printer className="w-4 h-4 mr-1.5" /> Print Prescription (A4)
          </Button>
        </div>
      </div>

      {/* Printable Sheet (Standard A4 Medical Prescription Format) */}
      <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-lg text-slate-900 print:shadow-none print:border-none print:p-4 print:max-w-full">
        {/* Clinic Header */}
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
              Tel: {SEED_SETTINGS.phone} • Email: {SEED_SETTINGS.email} • Reg: {SEED_SETTINGS.registration_no}
            </p>
          </div>

          {/* Doctor Badge */}
          <div className="text-right">
            <div className="font-bold text-sm text-teal-800">{prescription.doctor?.full_name}</div>
            <div className="text-xs font-semibold text-slate-700">{prescription.doctor?.specialty}</div>
            <div className="text-[11px] text-slate-500">{prescription.doctor?.qualification}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">PMC License Verified</div>
          </div>
        </div>

        {/* Patient Demographics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 my-6 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Patient Name</span>
            <span className="font-bold text-slate-900 text-sm">{prescription.patient?.full_name}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">MRN / ID</span>
            <span className="font-mono font-bold text-teal-700">{prescription.patient?.patient_mrn}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Age / Gender</span>
            <span className="font-semibold text-slate-800 capitalize">
              {prescription.patient?.age || '45'} yrs / {prescription.patient?.gender || 'Male'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] font-semibold uppercase">Prescription Date</span>
            <span className="font-semibold text-slate-800">{formatDate(prescription.prescription_date)}</span>
          </div>
        </div>

        {/* Rx Watermark & Medicine Body */}
        <div className="space-y-6 min-h-[380px]">
          <div className="flex items-center gap-2 text-2xl font-serif font-black text-teal-800 italic">
            ℞
          </div>

          <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {prescription.items?.map((item, idx) => (
              <div key={idx} className="py-4 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>{idx + 1}. {item.medicine_name}</span>
                    <span className="text-xs font-normal text-slate-500">({item.dosage})</span>
                  </div>
                  <div className="text-xs font-semibold text-teal-800">
                    Frequency: {item.frequency} • Course: {item.duration}
                  </div>
                  {item.instructions && (
                    <div className="text-xs text-slate-600 italic">
                      Instructions: {item.instructions}
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-700">Qty: {item.quantity} units</span>
                </div>
              </div>
            ))}
          </div>

          {/* Advice / Notes */}
          {prescription.notes && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-800 block uppercase tracking-wider text-[10px]">
                Physician Advice & Dietary Instructions:
              </span>
              <p className="text-slate-700 leading-relaxed">{prescription.notes}</p>
            </div>
          )}
        </div>

        {/* Signature & Seal Footer */}
        <div className="pt-12 mt-12 border-t border-slate-200 grid grid-cols-2 gap-8 items-end text-xs">
          <div>
            <p className="text-[11px] text-slate-400">
              * Valid for 30 days from date of issue.
              <br />
              * Not valid without registered physician signature & official clinic seal.
            </p>
          </div>

          <div className="text-center space-y-2 ml-auto w-48">
            <div className="border-b-2 border-slate-800 pb-8" />
            <div className="font-bold text-slate-900">{prescription.doctor?.full_name}</div>
            <div className="text-[10px] text-slate-500">Authorized Medical Practitioner</div>
          </div>
        </div>
      </div>
    </div>
  );
}
