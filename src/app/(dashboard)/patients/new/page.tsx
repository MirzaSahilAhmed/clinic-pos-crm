'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserPlus,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Phone,
  User,
  Heart,
  Shield,
  MapPin,
  Calendar,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, Textarea } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ClinicService, SEED_DOCTORS, SEED_PATIENTS } from '@/services/clinic-service';
import { createClient } from '@/lib/supabase/client';

export default function NewPatientPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [duplicateWarning, setDuplicateWarning] = React.useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = React.useState('');
  const [gender, setGender] = React.useState<'male' | 'female' | 'other'>('male');
  const [dob, setDob] = React.useState('');
  const [age, setAge] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [city, setCity] = React.useState('Karachi');
  const [emergencyName, setEmergencyName] = React.useState('');
  const [emergencyPhone, setEmergencyPhone] = React.useState('');
  const [bloodGroup, setBloodGroup] = React.useState('');
  const [allergies, setAllergies] = React.useState('');
  const [medicalConditions, setMedicalConditions] = React.useState('');
  const [patientSource, setPatientSource] = React.useState('Walk-in');
  const [assignedDoctorId, setAssignedDoctorId] = React.useState(SEED_DOCTORS[0].id);
  const [notes, setNotes] = React.useState('');

  // Duplicate Check
  const checkDuplicate = (enteredPhone: string, enteredName: string) => {
    if (!enteredPhone && !enteredName) {
      setDuplicateWarning(null);
      return;
    }
    const cleanPhone = enteredPhone.replace(/[^0-9]/g, '');
    const found = SEED_PATIENTS.find((p) => {
      const matchPhone = cleanPhone && p.phone.replace(/[^0-9]/g, '').includes(cleanPhone);
      const matchName = enteredName && p.full_name.toLowerCase() === enteredName.toLowerCase().trim();
      return matchPhone || matchName;
    });

    if (found) {
      setDuplicateWarning(
        `Potential duplicate detected! Patient "${found.full_name}" (${found.patient_mrn}) is already registered with phone ${found.phone}.`
      );
    } else {
      setDuplicateWarning(null);
    }
  };

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    checkDuplicate(val, fullName);
  };

  const handleNameChange = (val: string) => {
    setFullName(val);
    checkDuplicate(phone, val);
  };

  const copyPhoneToWhatsApp = () => {
    setWhatsapp(phone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const clinicId = process.env.NEXT_PUBLIC_CLINIC_ID || '11111111-1111-1111-1111-111111111111';
      const mrn = `PAT-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;

      if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
        await supabase.from('patients').insert({
          clinic_id: clinicId,
          patient_mrn: mrn,
          full_name: fullName,
          gender,
          dob: dob || null,
          age: age ? parseInt(age, 10) : null,
          phone,
          whatsapp: whatsapp || phone,
          email: email || null,
          address: address || null,
          city: city || 'Karachi',
          emergency_contact_name: emergencyName || null,
          emergency_contact_phone: emergencyPhone || null,
          blood_group: bloodGroup || null,
          allergies: allergies || null,
          medical_conditions: medicalConditions || null,
          patient_source: patientSource,
          assigned_doctor_id: assignedDoctorId,
          status: 'active',
          notes: notes || null,
        });
      }

      router.push('/patients');
    } catch {
      router.push('/patients');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/patients">
            <Button size="icon" variant="outline" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Register New Patient</h1>
            <p className="text-xs text-slate-500">Create digital medical record & CRM profile</p>
          </div>
        </div>

        <Badge variant="primary" className="font-mono text-xs px-3 py-1">
          Auto MRN: PAT-2026-XXXX
        </Badge>
      </div>

      {/* Duplicate Alert */}
      {duplicateWarning && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3 animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold">Duplicate Notice: </span>
            {duplicateWarning}
          </div>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* 1. Demographics & Personal Info */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                <User className="w-4 h-4 text-teal-600" /> 1. Personal & Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                  <Input
                    required
                    value={fullName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Muhammad Farooq"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Gender *</label>
                  <Select
                    value={gender}
                    onChange={(e: any) => setGender(e.target.value)}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Phone Number (PK) *</label>
                  <Input
                    required
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="0300 1234567"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700">WhatsApp Number</label>
                    <button
                      type="button"
                      onClick={copyPhoneToWhatsApp}
                      className="text-[10px] text-teal-600 hover:underline font-semibold"
                    >
                      Same as Phone
                    </button>
                  </div>
                  <Input
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="0300 1234567"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patient@example.pk"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Date of Birth</label>
                  <Input
                    type="date"
                    value={dob}
                    onChange={(e) => {
                      setDob(e.target.value);
                      if (e.target.value) {
                        const birthYear = new Date(e.target.value).getFullYear();
                        const currentYear = new Date().getFullYear();
                        setAge(String(Math.max(0, currentYear - birthYear)));
                      }
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Age (Years)</label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 45"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">City</label>
                  <Input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Karachi, Lahore, etc."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Residential Address</label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House / Apartment number, Street, Phase, Area"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. Medical Background & Emergency Contact */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                <Heart className="w-4 h-4 text-rose-500" /> 2. Clinical Profile & Emergency Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Blood Group</label>
                  <Select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Emergency Contact Name</label>
                  <Input
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Spouse, Father, or Relative"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Emergency Phone</label>
                  <Input
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="0300 9876543"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Known Drug & Food Allergies</label>
                  <Textarea
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g. Penicillin, Sulfa, Aspirin, Peanuts, Pollen..."
                    className="min-h-[70px]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Chronic Medical Conditions</label>
                  <Textarea
                    value={medicalConditions}
                    onChange={(e) => setMedicalConditions(e.target.value)}
                    placeholder="e.g. Hypertension, Type 2 Diabetes, Asthma, Chronic Kidney Disease..."
                    className="min-h-[70px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Clinic Assignment & Notes */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                <Shield className="w-4 h-4 text-indigo-600" /> 3. Consultation Assignment & CRM Source
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Assigned Primary Doctor</label>
                  <Select
                    value={assignedDoctorId}
                    onChange={(e) => setAssignedDoctorId(e.target.value)}
                  >
                    {SEED_DOCTORS.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.full_name} ({doc.specialty})
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Patient Acquisition Source</label>
                  <Select
                    value={patientSource}
                    onChange={(e) => setPatientSource(e.target.value)}
                  >
                    <option value="Walk-in">Walk-in Reception</option>
                    <option value="Referral">Patient / Family Referral</option>
                    <option value="Doctor Referral">Doctor / Hospital Referral</option>
                    <option value="Social Media">Social Media (Facebook / Instagram)</option>
                    <option value="Google Search">Google Search & Maps</option>
                    <option value="Corporate / Panel">Corporate / Insurance Panel</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Clinical Reception Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional patient notes, preferred communication time, etc."
                  className="min-h-[60px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4 bg-slate-50/50">
              <Link href="/patients">
                <Button type="button" variant="outline" size="sm">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" size="md" isLoading={loading} className="bg-teal-600 hover:bg-teal-700">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Complete Registration
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
