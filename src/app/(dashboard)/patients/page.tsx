'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  MoreVertical,
  Calendar,
  FileText,
  DollarSign,
  Phone,
  Eye,
  Edit,
  Activity,
  ArrowUpDown,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ClinicService, SEED_PATIENTS } from '@/services/clinic-service';
import { Patient } from '@/types/database.types';

function PatientsListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const [patients, setPatients] = React.useState<Patient[]>(SEED_PATIENTS);
  const [search, setSearch] = React.useState(initialQuery);
  const [selectedGender, setSelectedGender] = React.useState('all');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [sortBy, setSortBy] = React.useState<'name' | 'mrn' | 'date'>('date');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');

  React.useEffect(() => {
    async function load() {
      const data = await ClinicService.getPatients(search);
      setPatients(data);
    }
    load();
  }, [search]);

  // Filtering
  const filteredPatients = patients
    .filter((p) => {
      if (selectedGender !== 'all' && p.gender !== selectedGender) return false;
      if (selectedStatus !== 'all' && p.status !== selectedStatus) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.full_name.localeCompare(b.full_name)
          : b.full_name.localeCompare(a.full_name);
      }
      if (sortBy === 'mrn') {
        return sortOrder === 'asc'
          ? a.patient_mrn.localeCompare(b.patient_mrn)
          : b.patient_mrn.localeCompare(a.patient_mrn);
      }
      return sortOrder === 'asc'
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const exportCSV = () => {
    const headers = ['MRN', 'Full Name', 'Phone', 'Gender', 'Age', 'Blood Group', 'City', 'Registered Date'];
    const rows = filteredPatients.map((p) => [
      p.patient_mrn,
      `"${p.full_name}"`,
      p.phone,
      p.gender,
      p.age || '',
      p.blood_group || '',
      p.city || '',
      formatDate(p.created_at),
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Patients_AlShifa_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600" />
            Patient Directory & CRM
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage comprehensive medical files, visit timelines, and contact history
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={exportCSV} className="border-slate-300">
            <Download className="w-4 h-4 mr-1 text-slate-600" /> Export CSV
          </Button>
          <Link href="/patients/new">
            <Button variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700 shadow-sm">
              <UserPlus className="w-4 h-4 mr-1.5" /> Register New Patient
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Patient Name, MRN (PAT-2026-...), or Phone..."
                className="pl-9 bg-slate-50 border-slate-200"
              />
            </div>

            {/* Gender Filter */}
            <Select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="bg-slate-50"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>

            {/* Status Filter */}
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patients Data Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 cursor-pointer hover:text-slate-800" onClick={() => { setSortBy('mrn'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                  <div className="flex items-center gap-1">
                    MRN / ID <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-slate-800" onClick={() => { setSortBy('name'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}>
                  <div className="flex items-center gap-1">
                    Patient Name <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Contact (PK)</th>
                <th className="py-3.5 px-4">Demographics</th>
                <th className="py-3.5 px-4">Primary Doctor</th>
                <th className="py-3.5 px-4">Visits</th>
                <th className="py-3.5 px-4">Balance</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-medium text-slate-700">No patient records found</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria</p>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-3 px-4 font-mono font-semibold text-teal-700">
                      <Link href={`/patients/${p.id}`} className="hover:underline">
                        {p.patient_mrn}
                      </Link>
                    </td>

                    <td className="py-3 px-4">
                      <Link href={`/patients/${p.id}`} className="block">
                        <div className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {p.full_name}
                        </div>
                        {p.blood_group && (
                          <div className="text-[10px] text-slate-400 font-medium">
                            Blood: <span className="font-semibold text-slate-600">{p.blood_group}</span>
                          </div>
                        )}
                      </Link>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{p.phone}</div>
                      <div className="text-[10px] text-slate-400">{p.city || 'Karachi'}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 capitalize">
                      {p.gender}, {p.age ? `${p.age} yrs` : '-'}
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {p.assigned_doctor?.full_name || 'Dr. Tariq Mahmood'}
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <div className="font-semibold">{p.total_visits || 1}</div>
                      <div className="text-[10px] text-slate-400">
                        {p.last_visit_date ? formatDate(p.last_visit_date) : 'Recent'}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {(p.outstanding_balance || 0) > 0 ? (
                        <span className="font-semibold text-rose-600">
                          {formatCurrency(p.outstanding_balance!)}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">Cleared</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <Badge variant={p.status === 'active' ? 'success' : 'default'} className="capitalize">
                        {p.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link href={`/patients/${p.id}`}>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-teal-600 hover:bg-teal-50" title="View Patient Profile">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Link href={`/pos?patientId=${p.id}`}>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-600 hover:bg-slate-100" title="Open POS Sale">
                            <DollarSign className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredPatients.length} of {patients.length} patients registered</span>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="outline" disabled className="h-7 px-2 text-xs">Previous</Button>
            <Button size="sm" variant="outline" disabled className="h-7 px-2 text-xs">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function PatientsListPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Patient Records...</div>}>
      <PatientsListContent />
    </React.Suspense>
  );
}
