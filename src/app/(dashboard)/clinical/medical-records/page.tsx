'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Filter,
  User,
  Activity,
  Calendar,
  Eye,
  Download,
  Stethoscope,
  Pill,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import { SEED_PATIENTS } from '@/services/clinic-service';

export default function MedicalRecordsPage() {
  const [search, setSearch] = React.useState('');

  const records = [
    {
      id: 'rec-1',
      patient: SEED_PATIENTS[0],
      title: 'Cardiac Evaluation & 12-Lead ECG Report',
      date: '2026-11-04',
      type: 'Diagnostic Report',
      doctor: 'Dr. Tariq Mahmood',
      summary: 'Sinus rhythm, HR 76, no acute ischemic ST-T changes. Baseline BP 135/85.',
    },
    {
      id: 'rec-2',
      patient: SEED_PATIENTS[1],
      title: 'Throat Swab & General Examination',
      date: '2026-11-05',
      type: 'Consultation Note',
      doctor: 'Dr. Bilal Khan',
      summary: 'Erythematous posterior pharynx. Prescribed 5-day course Augmentin.',
    },
    {
      id: 'rec-3',
      patient: SEED_PATIENTS[3],
      title: 'Fasting Blood Sugar & HbA1c Lab Report',
      date: '2026-11-03',
      type: 'Laboratory Report',
      doctor: 'Dr. Tariq Mahmood',
      summary: 'HbA1c 7.4% (moderate control). Fasting BSL 138 mg/dL.',
    },
  ];

  const filtered = records.filter(
    (r) =>
      r.patient.full_name.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" />
            Centralized Patient Medical Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Historical laboratory results, diagnostic attachments, and physician case summaries
          </p>
        </div>

        <Link href="/clinical/consultations/new">
          <Button variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
            <Stethoscope className="w-4 h-4 mr-1.5" /> New Medical Entry
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
              placeholder="Search medical records by patient name or report title..."
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <Card key={r.id} className="hover:border-teal-300 transition-colors bg-white">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="primary" className="text-[10px]">{r.type}</Badge>
                <span className="text-[11px] text-slate-400">{formatDate(r.date)}</span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900">{r.title}</h3>
                <div className="text-xs text-slate-600 font-semibold mt-0.5">{r.patient.full_name} ({r.patient.patient_mrn})</div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs text-slate-600 leading-relaxed">
                {r.summary}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">{r.doctor}</span>
                <Link href={`/patients/${r.patient.id}`}>
                  <Button size="sm" variant="ghost" className="text-teal-600 h-7 px-2">
                    <Eye className="w-3.5 h-3.5 mr-1" /> View File
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
