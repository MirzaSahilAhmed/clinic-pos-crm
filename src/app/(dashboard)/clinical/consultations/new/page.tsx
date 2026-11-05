'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Stethoscope,
  ArrowLeft,
  Activity,
  Heart,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Scale,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, Textarea } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { calculateBMI } from '@/lib/utils';
import { ClinicService, SEED_DOCTORS, SEED_PATIENTS } from '@/services/clinic-service';
import { createClient } from '@/lib/supabase/client';

function NewConsultationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPatientId = searchParams.get('patientId') || SEED_PATIENTS[0].id;

  const [patientId, setPatientId] = React.useState(defaultPatientId);
  const [doctorId, setDoctorId] = React.useState(SEED_DOCTORS[0].id);

  // SOAP Fields
  const [chiefComplaint, setChiefComplaint] = React.useState('');
  const [symptoms, setSymptoms] = React.useState('');
  const [history, setHistory] = React.useState('');
  const [allergies, setAllergies] = React.useState('');

  // Vitals
  const [systolic, setSystolic] = React.useState('120');
  const [diastolic, setDiastolic] = React.useState('80');
  const [pulse, setPulse] = React.useState('72');
  const [temp, setTemp] = React.useState('98.6');
  const [weightKg, setWeightKg] = React.useState('70');
  const [heightCm, setHeightCm] = React.useState('170');
  const [spo2, setSpo2] = React.useState('98');
  const [respiratoryRate, setRespiratoryRate] = React.useState('18');

  // Diagnosis & Treatment
  const [diagnosis, setDiagnosis] = React.useState('');
  const [examNotes, setExamNotes] = React.useState('');
  const [treatmentPlan, setTreatmentPlan] = React.useState('');
  const [followUpDate, setFollowUpDate] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Live BMI Calculation
  const bmiResult = React.useMemo(() => {
    const w = parseFloat(weightKg);
    const h = parseFloat(heightCm);
    if (!isNaN(w) && !isNaN(h)) {
      return calculateBMI(w, h);
    }
    return null;
  }, [weightKg, heightCm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const clinicId = process.env.NEXT_PUBLIC_CLINIC_ID || '11111111-1111-1111-1111-111111111111';
      const visitNum = `VST-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;

      if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
        const { data: visitData, error: visitError } = await supabase
          .from('visits')
          .insert({
            clinic_id: clinicId,
            visit_number: visitNum,
            patient_id: patientId,
            doctor_id: doctorId,
            chief_complaint: chiefComplaint,
            symptoms,
            medical_history: history,
            examination_notes: examNotes,
            diagnosis,
            treatment_plan: treatmentPlan,
            follow_up_date: followUpDate || null,
            status: 'completed',
          })
          .select('id')
          .single();

        if (visitData?.id) {
          await supabase.from('visit_vitals').insert({
            visit_id: visitData.id,
            blood_pressure_systolic: parseInt(systolic, 10) || null,
            blood_pressure_diastolic: parseInt(diastolic, 10) || null,
            heart_rate: parseInt(pulse, 10) || null,
            temperature: parseFloat(temp) || null,
            weight_kg: parseFloat(weightKg) || null,
            height_cm: parseFloat(heightCm) || null,
            oxygen_saturation: parseInt(spo2, 10) || null,
            respiratory_rate: parseInt(respiratoryRate, 10) || null,
            bmi: bmiResult?.bmi || null,
          });
        }
      }

      router.push(`/clinical/prescriptions/new?patientId=${patientId}`);
    } catch {
      router.push(`/clinical/prescriptions/new?patientId=${patientId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/clinical/consultations">
            <Button size="icon" variant="outline" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Consultation & Vitals Record</h1>
            <p className="text-xs text-slate-500">Record comprehensive clinical history & physical findings</p>
          </div>
        </div>

        <Badge variant="primary" className="font-mono text-xs">
          Auto VST-2026-XXXX
        </Badge>
      </div>

      {/* Clinical responsibility disclaimer */}
      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center gap-3 text-xs">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
        <span>
          <strong>Clinical Documentation Tool:</strong> Healthcare practitioners remain autonomously responsible for medical diagnoses, examinations, and prescriptive treatment decisions.
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient & Doctor Selection */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <User className="w-4 h-4 text-teal-600" /> Patient Encounter Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Consulting Doctor *</label>
              <Select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                required
              >
                {SEED_DOCTORS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.full_name} ({d.specialty})
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vital Signs with Automatic BMI Calculation */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <Activity className="w-4 h-4 text-rose-500" /> Objective Vitals & Anthropometrics
            </CardTitle>
            {bmiResult && (
              <Badge variant="primary" className="text-xs">
                BMI: {bmiResult.bmi} ({bmiResult.category})
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Systolic BP (mmHg)</label>
              <Input
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                placeholder="120"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Diastolic BP (mmHg)</label>
              <Input
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                placeholder="80"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Heart Rate (bpm)</label>
              <Input
                type="number"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                placeholder="72"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Temperature (°F)</label>
              <Input
                type="number"
                step="0.1"
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                placeholder="98.6"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Weight (kg)</label>
              <Input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="70"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Height (cm)</label>
              <Input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="170"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">SpO2 Oxygen (%)</label>
              <Input
                type="number"
                value={spo2}
                onChange={(e) => setSpo2(e.target.value)}
                placeholder="98"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Respiratory Rate (/min)</label>
              <Input
                type="number"
                value={respiratoryRate}
                onChange={(e) => setRespiratoryRate(e.target.value)}
                placeholder="18"
              />
            </div>
          </CardContent>
        </Card>

        {/* Subjective: Chief Complaints & Symptoms */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <FileText className="w-4 h-4 text-teal-600" /> Subjective Complaints & History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Chief Complaint *</label>
              <Input
                required
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="e.g. Severe headache for 3 days, palpitations upon exertion"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">History of Present Illness (HPI)</label>
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Onset, duration, intensity, aggravating and relieving factors..."
                  className="min-h-[70px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Past Medical & Surgical History</label>
                <Textarea
                  value={history}
                  onChange={(e) => setHistory(e.target.value)}
                  placeholder="Prior hospitalizations, chronic conditions, family history..."
                  className="min-h-[70px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objective Examination & Assessment / Diagnosis */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <Stethoscope className="w-4 h-4 text-sky-600" /> Examination Findings & Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Physical Examination Findings</label>
              <Textarea
                value={examNotes}
                onChange={(e) => setExamNotes(e.target.value)}
                placeholder="General appearance, chest auscultation, cardiovascular sounds, abdominal palpation..."
                className="min-h-[70px]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Primary Clinical Assessment / Diagnosis *</label>
              <Input
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Essential Hypertension Stage 1, Acute Bronchitis"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Treatment Plan & Patient Advice</label>
                <Textarea
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  placeholder="Dietary recommendations, salt restriction, lifestyle modifications..."
                  className="min-h-[70px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Follow-up Date Recommendation</label>
                <Input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4 bg-slate-50/50">
            <Link href="/clinical/consultations">
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" size="md" isLoading={loading} className="bg-teal-600 hover:bg-teal-700">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Save Visit & Proceed to Prescription &rarr;
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default function NewConsultationPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Clinical Encounter...</div>}>
      <NewConsultationContent />
    </React.Suspense>
  );
}
