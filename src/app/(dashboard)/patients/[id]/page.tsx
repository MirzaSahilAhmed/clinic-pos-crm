'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  User,
  ArrowLeft,
  Calendar,
  Stethoscope,
  FileText,
  DollarSign,
  Phone,
  MessageSquare,
  Clock,
  Heart,
  AlertCircle,
  Plus,
  ShoppingCart,
  Send,
  CheckCircle2,
  Share2,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import {
  ClinicService,
  SEED_PATIENTS,
  SEED_APPOINTMENTS,
  SEED_INVOICES,
  SEED_PRESCRIPTIONS,
  SEED_FOLLOWUPS,
} from '@/services/clinic-service';
import { Patient } from '@/types/database.types';

export default function PatientProfilePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params?.id as string;

  const [patient, setPatient] = React.useState<Patient | null>(null);
  const [activeTab, setActiveTab] = React.useState('overview');

  React.useEffect(() => {
    async function load() {
      const p = await ClinicService.getPatientById(patientId);
      setPatient(p);
    }
    load();
  }, [patientId]);

  if (!patient) {
    return (
      <div className="py-20 text-center text-slate-500">
        <User className="w-10 h-10 text-slate-300 mx-auto mb-2 animate-pulse" />
        <p className="font-semibold text-slate-700">Loading Patient File...</p>
      </div>
    );
  }

  const patientAppointments = SEED_APPOINTMENTS.filter((a) => a.patient_id === patient.id || a.patient?.full_name === patient.full_name);
  const patientInvoices = SEED_INVOICES.filter((i) => i.patient_id === patient.id || i.patient?.full_name === patient.full_name);
  const patientPrescriptions = SEED_PRESCRIPTIONS.filter((p) => p.patient_id === patient.id || p.patient?.full_name === patient.full_name);
  const patientFollowUps = SEED_FOLLOWUPS.filter((f) => f.patient_id === patient.id || f.patient?.full_name === patient.full_name);

  const cleanPhone = patient.phone.replace(/[^0-9]/g, '');
  const whatsAppUrl = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(patient.full_name)},%20this%20is%20Al-Shifa%20Clinic.`;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/patients">
            <Button size="icon" variant="outline" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {patient.full_name}
              </h1>
              <Badge variant="primary" className="font-mono text-xs">
                {patient.patient_mrn}
              </Badge>
              <Badge variant={patient.status === 'active' ? 'success' : 'default'} className="capitalize text-xs">
                {patient.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Registered on {formatDate(patient.created_at)} • Source: {patient.patient_source || 'Direct'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href={whatsAppUrl} target="_blank">
            <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50">
              <MessageSquare className="w-4 h-4 mr-1 text-emerald-600" /> WhatsApp
            </Button>
          </Link>
          <Link href={`/appointments/new?patientId=${patient.id}`}>
            <Button variant="outline" size="sm" className="border-slate-300">
              <Calendar className="w-4 h-4 mr-1 text-sky-600" /> Book Visit
            </Button>
          </Link>
          <Link href={`/clinical/consultations/new?patientId=${patient.id}`}>
            <Button variant="outline" size="sm" className="border-slate-300">
              <Stethoscope className="w-4 h-4 mr-1 text-teal-600" /> New Consult
            </Button>
          </Link>
          <Link href={`/pos?patientId=${patient.id}`}>
            <Button variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700 shadow-sm">
              <ShoppingCart className="w-4 h-4 mr-1.5" /> POS Billing
            </Button>
          </Link>
        </div>
      </div>

      {/* Patient Key Summary Card */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="bg-white">
          <CardContent className="p-3.5">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Phone</span>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1 truncate">{patient.phone}</div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-3.5">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Gender & Age</span>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1 capitalize">
              {patient.gender}, {patient.age ? `${patient.age} yrs` : '-'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-3.5">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Blood Group</span>
            <div className="text-xs sm:text-sm font-bold text-rose-600 mt-1">
              {patient.blood_group || 'Not recorded'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-3.5">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Primary Doctor</span>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1 truncate">
              {patient.assigned_doctor?.full_name || 'Dr. Tariq Mahmood'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-3.5">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Total Visits</span>
            <div className="text-xs sm:text-sm font-bold text-teal-700 mt-1">
              {patient.total_visits || 4} Completed
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-3.5">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Outstanding Balance</span>
            <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
              {(patient.outstanding_balance || 0) > 0 ? (
                <span className="text-rose-600">{formatCurrency(patient.outstanding_balance!)}</span>
              ) : (
                <span className="text-emerald-600 font-semibold">Cleared (₨0)</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Allergies & Warning Strip */}
      {(patient.allergies || patient.medical_conditions) && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Allergies: </strong>
              {patient.allergies || 'None recorded'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 shrink-0" />
            <span>
              <strong>Conditions: </strong>
              {patient.medical_conditions || 'None reported'}
            </span>
          </div>
        </div>
      )}

      {/* 9 Profile Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-5 pt-3 border-b border-slate-100">
            <TabsList className="border-none gap-2">
              <TabsTrigger value="overview">1. Overview</TabsTrigger>
              <TabsTrigger value="appointments" badge={patientAppointments.length}>
                2. Appointments
              </TabsTrigger>
              <TabsTrigger value="visits" badge="4">
                3. Visits & Vitals
              </TabsTrigger>
              <TabsTrigger value="prescriptions" badge={patientPrescriptions.length}>
                4. Prescriptions
              </TabsTrigger>
              <TabsTrigger value="invoices" badge={patientInvoices.length}>
                5. Invoices & Billing
              </TabsTrigger>
              <TabsTrigger value="followups" badge={patientFollowUps.length}>
                6. Follow-ups
              </TabsTrigger>
              <TabsTrigger value="comms">
                7. Communication History
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-6">
            {/* TAB 1: OVERVIEW */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Personal & Emergency File */}
                  <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200/80 space-y-4">
                    <h3 className="font-bold text-sm text-slate-800">Registration Details</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">Full Legal Name</span>
                        <span className="font-semibold text-slate-800">{patient.full_name}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Date of Birth</span>
                        <span className="font-semibold text-slate-800">{patient.dob ? formatDate(patient.dob) : '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">WhatsApp Number</span>
                        <span className="font-semibold text-slate-800">{patient.whatsapp || patient.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Emergency Contact</span>
                        <span className="font-semibold text-slate-800">{patient.emergency_contact_name || 'None listed'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Emergency Phone</span>
                        <span className="font-semibold text-slate-800">{patient.emergency_contact_phone || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">City & Address</span>
                        <span className="font-semibold text-slate-800">{patient.address || '-'}, {patient.city || 'Karachi'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Chronological Activity Timeline */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-slate-800">Chronological Patient Activity</h3>
                    <div className="space-y-3 pl-4 border-l-2 border-teal-500/30">
                      <div className="relative">
                        <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-teal-600 ring-4 ring-white" />
                        <div className="text-xs font-semibold text-slate-800">Completed Specialist Consultation</div>
                        <div className="text-[11px] text-slate-400">04/11/2026 • Dr. Tariq Mahmood (Room 101)</div>
                        <p className="text-xs text-slate-600 mt-1">Prescribed Concor 5mg. Vitals: BP 135/85, Pulse 76, BMI 26.4.</p>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-sky-500 ring-4 ring-white" />
                        <div className="text-xs font-semibold text-slate-800">POS Payment Settlement (₨4,000)</div>
                        <div className="text-[11px] text-slate-400">04/11/2026 • Invoice INV-2026-000001</div>
                        <p className="text-xs text-slate-600 mt-1">Split payment: ₨2,000 Cash + ₨2,000 Debit Card cleared.</p>
                      </div>

                      <div className="relative">
                        <span className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-400 ring-4 ring-white" />
                        <div className="text-xs font-semibold text-slate-800">Initial Patient Profile Created</div>
                        <div className="text-[11px] text-slate-400">14/10/2026 • Registered by Front Desk</div>
                        <p className="text-xs text-slate-600 mt-1">Auto MRN PAT-2026-0001 assigned. Referred by family.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Clinical Highlights */}
                <div className="space-y-4">
                  <div className="bg-teal-50/60 rounded-xl p-5 border border-teal-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-teal-900 uppercase tracking-wide">Latest Vitals</h4>
                      <Badge variant="primary" className="text-[10px]">04/11/2026</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                        <span className="text-slate-400 block text-[10px]">Blood Pressure</span>
                        <span className="font-bold text-slate-800 text-sm">135/85 mmHg</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                        <span className="text-slate-400 block text-[10px]">Heart Rate</span>
                        <span className="font-bold text-slate-800 text-sm">76 bpm</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                        <span className="text-slate-400 block text-[10px]">Weight / BMI</span>
                        <span className="font-bold text-slate-800 text-sm">78 kg (26.4)</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-teal-100">
                        <span className="text-slate-400 block text-[10px]">Temperature</span>
                        <span className="font-bold text-slate-800 text-sm">98.4 °F</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
                    <span className="font-bold text-slate-700 block">Reception Notes</span>
                    <p className="text-slate-500 leading-relaxed italic">
                      {patient.notes || 'No extra clinical notes recorded.'}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: APPOINTMENTS */}
            <TabsContent value="appointments">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-800">Appointment Records</h3>
                  <Link href={`/appointments/new?patientId=${patient.id}`}>
                    <Button size="sm" variant="primary">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Schedule Appointment
                    </Button>
                  </Link>
                </div>
                <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden text-xs">
                  {patientAppointments.map((a) => (
                    <div key={a.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <div className="font-semibold text-slate-900">{formatDate(a.appointment_date)} at {formatTime(a.start_time)}</div>
                        <div className="text-slate-500 text-[11px] mt-0.5">{a.doctor?.full_name} • {a.reason}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={a.status === 'completed' ? 'success' : 'primary'} className="capitalize">
                          {a.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: PRESCRIPTIONS */}
            <TabsContent value="prescriptions">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-800">Medical Prescriptions History</h3>
                  <Link href={`/clinical/prescriptions/new?patientId=${patient.id}`}>
                    <Button size="sm" variant="primary">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Create Prescription
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {patientPrescriptions.map((rx) => (
                    <Card key={rx.id} className="border-teal-200/80 bg-teal-50/20">
                      <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <div>
                          <span className="font-mono font-bold text-xs text-teal-800">{rx.prescription_number}</span>
                          <span className="text-slate-400 text-xs ml-2">• Issued by {rx.doctor?.full_name}</span>
                        </div>
                        <Link href={`/clinical/prescriptions/${rx.id}/print`}>
                          <Button size="sm" variant="outline" className="border-slate-300">
                            <Printer className="w-3.5 h-3.5 mr-1 text-slate-600" /> Print RX
                          </Button>
                        </Link>
                      </CardHeader>
                      <CardContent>
                        <div className="divide-y divide-slate-100 bg-white rounded-lg border border-slate-200">
                          {rx.items?.map((item, idx) => (
                            <div key={idx} className="p-3 text-xs flex items-center justify-between">
                              <div>
                                <span className="font-bold text-slate-900">{item.medicine_name}</span>
                                <span className="text-slate-500 text-[11px] ml-2">({item.dosage})</span>
                                <div className="text-[11px] text-teal-700 font-medium mt-0.5">
                                  {item.frequency} • {item.duration} • Qty: {item.quantity}
                                </div>
                              </div>
                              <span className="text-slate-400 italic text-[11px]">{item.instructions}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* TAB 5: INVOICES */}
            <TabsContent value="invoices">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-800">Billing & POS Invoices</h3>
                  <Link href={`/pos?patientId=${patient.id}`}>
                    <Button size="sm" variant="primary">
                      <ShoppingCart className="w-3.5 h-3.5 mr-1" /> New POS Sale
                    </Button>
                  </Link>
                </div>

                <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden text-xs">
                  {patientInvoices.map((inv) => (
                    <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{inv.invoice_number}</span>
                          <span className="text-slate-400">• {formatDate(inv.invoice_date)}</span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {inv.items?.length || 1} items billed • Handled by cashier
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 text-sm">{formatCurrency(inv.total_amount)}</div>
                        <Badge variant={inv.payment_status === 'paid' ? 'success' : 'warning'} className="text-[10px]">
                          {inv.payment_status === 'paid' ? 'Paid in Full' : `Due ${formatCurrency(inv.balance_due)}`}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* TAB 6: FOLLOW-UPS */}
            <TabsContent value="followups">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-800">Scheduled Follow-ups</h3>
                  <Button size="sm" variant="outline">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Follow-up
                  </Button>
                </div>
                <div className="divide-y divide-slate-100 border rounded-xl overflow-hidden text-xs">
                  {patientFollowUps.map((f) => (
                    <div key={f.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <div className="font-semibold text-slate-900">Due: {formatDate(f.follow_up_date)}</div>
                        <p className="text-slate-500 text-[11px] mt-0.5">{f.notes}</p>
                      </div>
                      <Badge variant="warning">{f.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* TAB 7: COMMUNICATIONS */}
            <TabsContent value="comms">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-800">Communication Logs</h3>
                  <Link href={whatsAppUrl} target="_blank">
                    <Button size="sm" variant="primary" className="bg-emerald-600 hover:bg-emerald-700">
                      <Send className="w-3.5 h-3.5 mr-1" /> Send WhatsApp Message
                    </Button>
                  </Link>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">WhatsApp Notification: Appointment Confirmed</span>
                    <span className="text-[10px] text-slate-400">04/11/2026 10:15 AM</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Automated confirmation dispatched to {patient.phone} for Dr. Tariq Mahmood consultation.
                  </p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
