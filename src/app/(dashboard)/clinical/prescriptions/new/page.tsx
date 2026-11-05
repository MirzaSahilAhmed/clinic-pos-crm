'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Pill,
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Printer,
  User,
  Stethoscope,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, Textarea } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ClinicService, SEED_DOCTORS, SEED_PATIENTS, SEED_PRODUCTS } from '@/services/clinic-service';
import { createClient } from '@/lib/supabase/client';

interface DrugRow {
  id: string;
  medicine_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions: string;
}

function NewPrescriptionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPatientId = searchParams.get('patientId') || SEED_PATIENTS[0].id;

  const [patientId, setPatientId] = React.useState(defaultPatientId);
  const [doctorId, setDoctorId] = React.useState(SEED_DOCTORS[0].id);
  const [rxDate, setRxDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = React.useState('Take medications as prescribed. Avoid salt and spicy food. Drink plenty of water.');
  const [loading, setLoading] = React.useState(false);

  const [medicines, setMedicines] = React.useState<DrugRow[]>([
    {
      id: '1',
      medicine_name: 'Panadol 500mg Tablets',
      dosage: '500mg',
      frequency: '1-0-1 (Twice daily)',
      duration: '5 Days',
      quantity: 10,
      instructions: 'Take after meals with water',
    },
  ]);

  const addMedicineRow = () => {
    setMedicines((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        medicine_name: '',
        dosage: '',
        frequency: '1-0-1 (Twice daily)',
        duration: '5 Days',
        quantity: 10,
        instructions: 'Take after meals',
      },
    ]);
  };

  const removeMedicineRow = (id: string) => {
    if (medicines.length === 1) return;
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMedicine = (id: string, field: keyof DrugRow, value: any) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleSelectProduct = (id: string, productName: string) => {
    const prod = SEED_PRODUCTS.find((p) => p.name === productName);
    if (prod) {
      updateMedicine(id, 'medicine_name', prod.name);
      updateMedicine(id, 'dosage', prod.generic_name || 'Standard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const clinicId = process.env.NEXT_PUBLIC_CLINIC_ID || '11111111-1111-1111-1111-111111111111';
      const rxNum = `RX-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;

      if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
        const { data: rxData } = await supabase
          .from('prescriptions')
          .insert({
            clinic_id: clinicId,
            prescription_number: rxNum,
            patient_id: patientId,
            doctor_id: doctorId,
            prescription_date: rxDate,
            notes,
          })
          .select('id')
          .single();

        if (rxData?.id) {
          const itemsToInsert = medicines.map((m) => ({
            prescription_id: rxData.id,
            medicine_name: m.medicine_name,
            dosage: m.dosage,
            frequency: m.frequency,
            duration: m.duration,
            quantity: m.quantity,
            instructions: m.instructions,
          }));

          await supabase.from('prescription_items').insert(itemsToInsert);
        }
      }

      router.push('/clinical/prescriptions');
    } catch {
      router.push('/clinical/prescriptions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/clinical/prescriptions">
            <Button size="icon" variant="outline" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Prescribe Medications (e-Rx)</h1>
            <p className="text-xs text-slate-500">Generate digital prescription connected with clinic pharmacy stock</p>
          </div>
        </div>

        <Badge variant="primary" className="font-mono text-xs">
          Auto RX-2026-XXXX
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient & Doctor */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <User className="w-4 h-4 text-teal-600" /> Patient & Prescriber Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Patient *</label>
              <Select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              >
                {SEED_PATIENTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} ({p.patient_mrn})
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Prescribing Doctor *</label>
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

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Date of Prescription</label>
              <Input
                type="date"
                value={rxDate}
                onChange={(e) => setRxDate(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Medicines Rows */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <Pill className="w-4 h-4 text-teal-600" /> Prescribed Medications (Rx)
            </CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMedicineRow}
              className="border-teal-300 text-teal-700 hover:bg-teal-50"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Medication Row
            </Button>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {medicines.map((med, idx) => (
              <div
                key={med.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-800">Drug #{idx + 1}</span>
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicineRow(med.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 rounded-md"
                      title="Remove Row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Medicine Name *</label>
                    <div className="flex gap-2">
                      <Input
                        required
                        value={med.medicine_name}
                        onChange={(e) => updateMedicine(med.id, 'medicine_name', e.target.value)}
                        placeholder="e.g. Augmentin 625mg or Concor 5mg"
                      />
                      <Select
                        className="w-36 text-xs"
                        onChange={(e) => handleSelectProduct(med.id, e.target.value)}
                        value=""
                      >
                        <option value="">Stock Quick-Pick</option>
                        {SEED_PRODUCTS.map((prod) => (
                          <option key={prod.id} value={prod.name}>
                            {prod.name}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Strength / Dosage</label>
                    <Input
                      value={med.dosage}
                      onChange={(e) => updateMedicine(med.id, 'dosage', e.target.value)}
                      placeholder="e.g. 500mg, 1 puff, 5ml"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Quantity (Units)</label>
                    <Input
                      type="number"
                      min="1"
                      value={med.quantity}
                      onChange={(e) => updateMedicine(med.id, 'quantity', parseInt(e.target.value, 10) || 1)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Frequency Schedule</label>
                    <Select
                      value={med.frequency}
                      onChange={(e) => updateMedicine(med.id, 'frequency', e.target.value)}
                    >
                      <option value="1-0-1 (Twice daily / BD)">1-0-1 (Twice daily / BD)</option>
                      <option value="1-0-0 (Once daily Morning / OD)">1-0-0 (Once daily Morning / OD)</option>
                      <option value="0-0-1 (Once daily Night / HS)">0-0-1 (Once daily Night / HS)</option>
                      <option value="1-1-1 (Thrice daily / TDS)">1-1-1 (Thrice daily / TDS)</option>
                      <option value="1-1-1-1 (Four times daily / QID)">1-1-1-1 (Four times daily / QID)</option>
                      <option value="As needed (SOS / PRN)">As needed (SOS / PRN)</option>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Course Duration</label>
                    <Select
                      value={med.duration}
                      onChange={(e) => updateMedicine(med.id, 'duration', e.target.value)}
                    >
                      <option value="3 Days">3 Days</option>
                      <option value="5 Days">5 Days</option>
                      <option value="7 Days">7 Days</option>
                      <option value="10 Days">10 Days</option>
                      <option value="14 Days">14 Days</option>
                      <option value="1 Month">1 Month</option>
                      <option value="Continuous / Chronic">Continuous / Chronic</option>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Dietary / Specific Instructions</label>
                    <Input
                      value={med.instructions}
                      onChange={(e) => updateMedicine(med.id, 'instructions', e.target.value)}
                      placeholder="e.g. Take after meals with glass of water"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Doctor Advice & Diet Notes */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <Info className="w-4 h-4 text-sky-600" /> Patient Dietary & Clinical Advice
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">General Doctor Advice for Patient</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Dietary precautions, exercise recommendations, follow-up instructions..."
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between p-4 bg-slate-50/50">
            <Link href="/clinical/prescriptions">
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="primary" size="md" isLoading={loading} className="bg-teal-600 hover:bg-teal-700">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Save e-Prescription Record
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default function NewPrescriptionPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Prescription Builder...</div>}>
      <NewPrescriptionContent />
    </React.Suspense>
  );
}
