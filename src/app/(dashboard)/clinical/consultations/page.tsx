'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  Plus,
  Search,
  Calendar,
  User,
  Activity,
  FileText,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import { SEED_PATIENTS, SEED_DOCTORS } from '@/services/clinic-service';

export default function ConsultationsListPage() {
  const [search, setSearch] = React.useState('');

  const consultations = [
    {
      id: 'vis-1',
      visit_number: 'VST-2026-0001',
      patient: SEED_PATIENTS[0],
      doctor: SEED_DOCTORS[0],
      date: '2026-11-04T10:30:00Z',
      chief_complaint: 'Palpitations and morning dizziness',
      diagnosis: 'Essential Hypertension Stage 1 (Grade 1)',
      bp: '135/85 mmHg',
      pulse: 76,
      bmi: 26.4,
      status: 'completed',
    },
    {
      id: 'vis-2',
      visit_number: 'VST-2026-0002',
      patient: SEED_PATIENTS[1],
      doctor: SEED_DOCTORS[2],
      date: '2026-11-05T11:00:00Z',
      chief_complaint: 'Throat congestion, painful swallowing, low-grade fever',
      diagnosis: 'Acute Streptococcal Pharyngitis',
      bp: '120/78 mmHg',
      pulse: 82,
      bmi: 22.1,
      status: 'completed',
    },
    {
      id: 'vis-3',
      visit_number: 'VST-2026-0003',
      patient: SEED_PATIENTS[3],
      doctor: SEED_DOCTORS[0],
      date: '2026-11-03T11:30:00Z',
      chief_complaint: 'Bilateral knee pain, increased thirst',
      diagnosis: 'Type 2 Diabetes Mellitus with Mild Knee Osteoarthritis',
      bp: '140/90 mmHg',
      pulse: 78,
      bmi: 28.5,
      status: 'completed',
    },
  ];

  const filtered = consultations.filter(
    (c) =>
      c.patient.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.visit_number.toLowerCase().includes(search.toLowerCase()) ||
      c.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-teal-600" />
            Clinical Consultations & SOAP Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Diagnostic history, vital sign evaluations, and treatment plans
          </p>
        </div>

        <Link href="/clinical/consultations/new">
          <Button variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700 shadow-sm">
            <Plus className="w-4 h-4 mr-1.5" /> Start New Consultation
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
              placeholder="Search by Patient Name, VST Number, or Diagnosis..."
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filtered.map((c) => (
          <Card key={c.id} className="hover:border-teal-300 transition-colors">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-xs">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-700">{c.visit_number}</span>
                      <span className="text-slate-300">•</span>
                      <h3 className="font-bold text-sm text-slate-900">{c.patient.full_name}</h3>
                      <Badge variant="outline" className="font-mono text-[10px]">{c.patient.patient_mrn}</Badge>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Attended by {c.doctor.full_name} • {formatDate(c.date)}
                    </div>
                  </div>
                </div>

                <Badge variant="success" className="text-xs capitalize self-start sm:self-auto">
                  {c.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Chief Complaint</span>
                  <p className="text-slate-800 font-medium mt-0.5">{c.chief_complaint}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Primary Assessment / Diagnosis</span>
                  <p className="text-teal-800 font-bold mt-0.5">{c.diagnosis}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block text-[11px]">Recorded Vitals</span>
                  <p className="text-slate-800 font-medium mt-0.5">
                    BP {c.bp} • HR {c.pulse} bpm • BMI {c.bmi}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <Link href={`/patients/${c.patient.id}`}>
                  <Button size="sm" variant="outline" className="text-xs h-8">
                    View Patient History
                  </Button>
                </Link>
                <Link href={`/clinical/prescriptions/new?patientId=${c.patient.id}`}>
                  <Button size="sm" variant="primary" className="text-xs h-8 bg-teal-600 hover:bg-teal-700">
                    <FileText className="w-3.5 h-3.5 mr-1" /> Prescribe Drugs
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
