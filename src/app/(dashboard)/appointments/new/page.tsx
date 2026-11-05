'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  User,
  Stethoscope,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, Textarea } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ClinicService, SEED_DOCTORS, SEED_PATIENTS, SEED_APPOINTMENTS } from '@/services/clinic-service';
import { createClient } from '@/lib/supabase/client';

function NewAppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPatientId = searchParams.get('patientId') || SEED_PATIENTS[0].id;

  const [patientId, setPatientId] = React.useState(defaultPatientId);
  const [doctorId, setDoctorId] = React.useState(SEED_DOCTORS[0].id);
  const [date, setDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = React.useState('10:00:00');
  const [endTime, setEndTime] = React.useState('10:20:00');
  const [appointmentType, setAppointmentType] = React.useState<'consultation' | 'follow_up' | 'procedure' | 'checkup'>('consultation');
  const [reason, setReason] = React.useState('');
  const [source, setSource] = React.useState<'walk_in' | 'phone' | 'online' | 'referral'>('phone');
  const [notes, setNotes] = React.useState('');

  const [conflictWarning, setConflictWarning] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Check scheduling conflict
  React.useEffect(() => {
    const conflict = SEED_APPOINTMENTS.find(
      (a) =>
        a.doctor_id === doctorId &&
        a.appointment_date === date &&
        a.start_time === startTime &&
        a.status !== 'cancelled'
    );

    if (conflict) {
      setConflictWarning(
        `Conflict Warning! Doctor already has an appointment booked for ${conflict.patient?.full_name} at this time slot (${startTime.slice(0, 5)}). Please select another time.`
      );
    } else {
      setConflictWarning(null);
    }
  }, [doctorId, date, startTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (conflictWarning) return;
    setLoading(true);

    try {
      const supabase = createClient();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const clinicId = process.env.NEXT_PUBLIC_CLINIC_ID || '11111111-1111-1111-1111-111111111111';
      const aptNum = `APT-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;

      if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
        await supabase.from('appointments').insert({
          clinic_id: clinicId,
          appointment_number: aptNum,
          patient_id: patientId,
          doctor_id: doctorId,
          appointment_date: date,
          start_time: startTime,
          end_time: endTime,
          appointment_type: appointmentType,
          reason,
          source,
          status: 'scheduled',
          notes,
        });
      }

      router.push('/appointments');
    } catch {
      router.push('/appointments');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/appointments">
            <Button size="icon" variant="outline" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Book Patient Appointment</h1>
            <p className="text-xs text-slate-500">Conflict-checked doctor scheduling system</p>
          </div>
        </div>
      </div>

      {conflictWarning && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 flex items-start gap-3 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">Doctor Conflict: </span>
            {conflictWarning}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <Calendar className="w-4 h-4 text-teal-600" /> Appointment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Patient *</label>
              <Select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              >
                {SEED_PATIENTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} ({p.patient_mrn} - {p.phone})
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Attending Doctor *</label>
                <Select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  required
                >
                  {SEED_DOCTORS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.full_name} ({d.specialty} - ₨{d.consultation_fee})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Appointment Type</label>
                <Select
                  value={appointmentType}
                  onChange={(e: any) => setAppointmentType(e.target.value)}
                >
                  <option value="consultation">Initial Consultation</option>
                  <option value="follow_up">Follow-up Visit</option>
                  <option value="procedure">Clinical Procedure</option>
                  <option value="checkup">Routine Health Checkup</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Date *</label>
                <Input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Start Time *</label>
                <Select
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    const [h, m] = e.target.value.split(':');
                    const endM = (parseInt(m, 10) + 20) % 60;
                    const endH = parseInt(m, 10) + 20 >= 60 ? parseInt(h, 10) + 1 : parseInt(h, 10);
                    setEndTime(`${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`);
                  }}
                >
                  <option value="09:00:00">09:00 AM</option>
                  <option value="09:30:00">09:30 AM</option>
                  <option value="10:00:00">10:00 AM</option>
                  <option value="10:30:00">10:30 AM</option>
                  <option value="11:00:00">11:00 AM</option>
                  <option value="11:30:00">11:30 AM</option>
                  <option value="12:00:00">12:00 PM</option>
                  <option value="14:00:00">02:00 PM</option>
                  <option value="14:30:00">02:30 PM</option>
                  <option value="15:00:00">03:00 PM</option>
                  <option value="15:30:00">03:30 PM</option>
                  <option value="16:00:00">04:00 PM</option>
                  <option value="17:00:00">05:00 PM</option>
                  <option value="18:00:00">06:00 PM</option>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Channel / Source</label>
                <Select
                  value={source}
                  onChange={(e: any) => setSource(e.target.value)}
                >
                  <option value="phone">Phone Booking</option>
                  <option value="walk_in">Walk-in</option>
                  <option value="online">Online Portal</option>
                  <option value="referral">Doctor Referral</option>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Reason for Visit *</label>
              <Input
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Chest discomfort, follow-up blood pressure, seasonal allergy"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Special Instructions / Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Patient prefers morning slot, requested fasting labs, etc."
                className="min-h-[60px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4 bg-slate-50/50">
            <Link href="/appointments">
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={Boolean(conflictWarning)}
              isLoading={loading}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Confirm Appointment
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default function NewAppointmentPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Appointment Scheduler...</div>}>
      <NewAppointmentContent />
    </React.Suspense>
  );
}
