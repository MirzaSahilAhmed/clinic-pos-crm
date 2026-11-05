'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  Printer,
  Calendar,
  User,
  Pill,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import { ClinicService, SEED_PRESCRIPTIONS } from '@/services/clinic-service';
import { Prescription } from '@/types/database.types';

export default function PrescriptionsListPage() {
  const [prescriptions, setPrescriptions] = React.useState<Prescription[]>(SEED_PRESCRIPTIONS);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    async function load() {
      const data = await ClinicService.getPrescriptions();
      setPrescriptions(data);
    }
    load();
  }, []);

  const filtered = prescriptions.filter(
    (p) =>
      p.patient?.full_name.toLowerCase().includes(search.toLowerCase()) ||
      p.prescription_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Pill className="w-6 h-6 text-teal-600" />
            Electronic Prescriptions (e-Rx)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Prescription repository, multi-dose drug regimens, and print-ready templates
          </p>
        </div>

        <Link href="/clinical/prescriptions/new">
          <Button variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700 shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" /> Write New Prescription
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by RX Number, Patient Name, or Drug..."
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filtered.map((rx) => (
          <Card key={rx.id} className="hover:border-teal-300 transition-colors bg-white">
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                    Rx
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-800">{rx.prescription_number}</span>
                      <span className="text-slate-300">•</span>
                      <h3 className="font-bold text-sm text-slate-900">{rx.patient?.full_name}</h3>
                      <Badge variant="outline" className="font-mono text-[10px]">{rx.patient?.patient_mrn}</Badge>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Prescribed by {rx.doctor?.full_name} • {formatDate(rx.prescription_date)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <Link href={`/clinical/prescriptions/${rx.id}/print`}>
                    <Button size="sm" variant="outline" className="border-slate-300">
                      <Printer className="w-3.5 h-3.5 mr-1 text-slate-600" /> Print Template
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Medicine Table preview */}
              <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-200/80">
                <div className="divide-y divide-slate-100 text-xs">
                  {rx.items?.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">{item.medicine_name}</span>
                        <span className="text-slate-500 ml-2">({item.dosage})</span>
                        <div className="text-[11px] text-teal-700 font-medium">
                          {item.frequency} • {item.duration} • Qty: {item.quantity}
                        </div>
                      </div>
                      <span className="text-slate-500 italic text-[11px]">{item.instructions}</span>
                    </div>
                  ))}
                </div>
              </div>

              {rx.notes && (
                <div className="text-xs text-slate-500 italic">
                  <strong>Doctor Advice: </strong> {rx.notes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
