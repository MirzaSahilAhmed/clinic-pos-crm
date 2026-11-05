'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Plus,
  Filter,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Stethoscope,
  Phone,
  Search,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { formatDate, formatTime } from '@/lib/utils';
import { ClinicService, SEED_APPOINTMENTS, SEED_DOCTORS } from '@/services/clinic-service';
import { Appointment } from '@/types/database.types';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = React.useState<Appointment[]>(SEED_APPOINTMENTS);
  const [selectedDoctor, setSelectedDoctor] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [viewMode, setViewMode] = React.useState<'daily' | 'weekly' | 'list'>('daily');
  const [currentDate, setCurrentDate] = React.useState(new Date().toISOString().split('T')[0]);

  // Modal Detail State
  const [activeAppointment, setActiveAppointment] = React.useState<Appointment | null>(null);

  React.useEffect(() => {
    async function load() {
      const data = await ClinicService.getAppointments();
      setAppointments(data);
    }
    load();
  }, []);

  const handleStatusUpdate = (newStatus: Appointment['status']) => {
    if (!activeAppointment) return;
    setAppointments((prev) =>
      prev.map((a) => (a.id === activeAppointment.id ? { ...a, status: newStatus } : a))
    );
    setActiveAppointment((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  const filteredAppointments = appointments.filter((a) => {
    if (selectedDoctor !== 'all' && a.doctor_id !== selectedDoctor) return false;
    if (selectedStatus !== 'all' && a.status !== selectedStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-teal-600" />
            Appointment Scheduling & Queues
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Doctor availability, conflict prevention, and queue management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/appointments/new">
            <Button variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700 shadow-sm">
              <Plus className="w-4 h-4 mr-1.5" /> Book Appointment
            </Button>
          </Link>
        </div>
      </div>

      {/* Control Strip: Doctors, Date Navigator & View Switcher */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="text-xs w-56 bg-slate-50"
            >
              <option value="all">All Doctors (Clinic-wide)</option>
              {SEED_DOCTORS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.full_name} ({d.specialty})
                </option>
              ))}
            </Select>

            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs w-40 bg-slate-50"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="in_consultation">In Consultation</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === 'daily' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Day
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === 'weekly' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                List View
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Slots / Queue View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAppointments.map((apt) => (
          <Card
            key={apt.id}
            className="hover:border-teal-300 transition-all cursor-pointer bg-white"
            onClick={() => setActiveAppointment(apt)}
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-teal-700">
                  {apt.appointment_number}
                </span>
                <Badge
                  variant={
                    apt.status === 'completed'
                      ? 'success'
                      : apt.status === 'in_consultation'
                      ? 'primary'
                      : apt.status === 'checked_in'
                      ? 'info'
                      : apt.status === 'scheduled'
                      ? 'warning'
                      : 'danger'
                  }
                  className="capitalize text-[10px]"
                >
                  {apt.status.replace('_', ' ')}
                </Badge>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900">{apt.patient?.full_name}</h3>
                <div className="text-xs text-slate-500 mt-0.5">{apt.patient?.phone}</div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>{formatTime(apt.start_time)} - {formatTime(apt.end_time)}</span>
                </div>
                <div className="text-slate-500 truncate">
                  {apt.doctor?.full_name} ({apt.doctor?.room_number || 'Room 101'})
                </div>
              </div>

              <div className="text-xs text-slate-500 italic truncate">
                Reason: {apt.reason || 'General checkup'}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="capitalize text-slate-400 font-medium">Source: {apt.source}</span>
                <span className="text-teal-600 font-semibold hover:underline">Manage Slot &rarr;</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Appointment Detail & Status Update Dialog */}
      {activeAppointment && (
        <Dialog open={Boolean(activeAppointment)} onOpenChange={() => setActiveAppointment(null)}>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogClose onClose={() => setActiveAppointment(null)} />
          </DialogHeader>
          <DialogContent className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-teal-700">{activeAppointment.appointment_number}</span>
                <Badge variant="primary" className="capitalize">
                  {activeAppointment.status.replace('_', ' ')}
                </Badge>
              </div>
              <div className="text-sm font-bold text-slate-900">{activeAppointment.patient?.full_name}</div>
              <div className="text-slate-500">{activeAppointment.patient?.phone}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block">Doctor Assigned</span>
                <span className="font-semibold text-slate-800">{activeAppointment.doctor?.full_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Time Slot</span>
                <span className="font-semibold text-slate-800">
                  {formatTime(activeAppointment.start_time)} ({activeAppointment.appointment_date})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Visit Type</span>
                <span className="font-semibold text-slate-800 capitalize">{activeAppointment.appointment_type}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Department / Room</span>
                <span className="font-semibold text-slate-800">{activeAppointment.doctor?.room_number || 'Room 101'}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block">Clinical Reason for Visit</span>
              <p className="font-medium text-slate-800 mt-0.5">{activeAppointment.reason}</p>
            </div>

            {/* Status Change Buttons */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="font-semibold text-slate-700 block">Update Queue Status:</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate('checked_in')}
                  className="border-sky-300 text-sky-700 hover:bg-sky-50"
                >
                  Check In
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate('in_consultation')}
                  className="border-teal-300 text-teal-700 hover:bg-teal-50"
                >
                  In Consult
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate('completed')}
                  className="border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                >
                  Completed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusUpdate('cancelled')}
                  className="border-rose-300 text-rose-700 hover:bg-rose-50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
          <DialogFooter>
            <Link href={`/clinical/consultations/new?appointmentId=${activeAppointment.id}&patientId=${activeAppointment.patient_id}`}>
              <Button size="sm" variant="primary" className="bg-teal-600 hover:bg-teal-700">
                <Stethoscope className="w-4 h-4 mr-1" /> Start Consultation Note
              </Button>
            </Link>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
}
