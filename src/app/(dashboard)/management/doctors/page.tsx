'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Stethoscope,
  Plus,
  Search,
  Phone,
  Mail,
  Clock,
  DollarSign,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { ClinicService, SEED_DOCTORS } from '@/services/clinic-service';
import { Doctor } from '@/types/database.types';

export default function DoctorsManagementPage() {
  const [doctors, setDoctors] = React.useState<Doctor[]>(SEED_DOCTORS);
  const [search, setSearch] = React.useState('');

  const filtered = doctors.filter(
    (d) =>
      d.full_name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-teal-600" />
            Medical Doctors & Specialists Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage practicing consultants, specialties, consultation fee tariffs, and shift rotas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filtered.map((doc) => (
          <Card key={doc.id} className="hover:border-teal-300 transition-colors bg-white">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm">
                  {doc.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{doc.full_name}</h3>
                  <div className="text-xs font-semibold text-teal-700">{doc.specialty}</div>
                  <div className="text-[11px] text-slate-400">{doc.qualification}</div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Initial Consultation:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(doc.consultation_fee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Follow-up Fee:</span>
                  <span className="font-semibold text-slate-700">{formatCurrency(doc.follow_up_fee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Room / Clinic:</span>
                  <span className="font-medium text-slate-800">{doc.room_number || 'Room 101'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Working Shift:</span>
                  <span className="font-medium text-slate-800">{doc.start_time.slice(0, 5)} - {doc.end_time.slice(0, 5)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-400">{doc.phone}</span>
                <Badge variant={doc.is_active ? 'success' : 'default'} className="text-[10px]">
                  {doc.is_active ? 'Active & On Duty' : 'On Leave'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
