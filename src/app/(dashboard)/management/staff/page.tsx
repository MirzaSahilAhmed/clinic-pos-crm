'use client';

import * as React from 'react';
import {
  Users,
  Plus,
  Search,
  Shield,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function StaffManagementPage() {
  const [search, setSearch] = React.useState('');

  const [staff, setStaff] = React.useState([
    {
      id: 'st-1',
      full_name: 'Dr. Tariq Mahmood',
      email: 'dr.tariq@alshifaclinic.pk',
      phone: '+92 300 2233441',
      role: 'super_admin',
      designation: 'Chief Medical Officer / Clinic Owner',
      status: 'active',
    },
    {
      id: 'st-2',
      full_name: 'Dr. Ayesha Siddiqui',
      email: 'dr.ayesha@alshifaclinic.pk',
      phone: '+92 321 8899112',
      role: 'doctor',
      designation: 'Consultant Pediatrician',
      status: 'active',
    },
    {
      id: 'st-3',
      full_name: 'Dr. Bilal Ahmed Khan',
      email: 'dr.bilal@alshifaclinic.pk',
      phone: '+92 333 4455667',
      role: 'doctor',
      designation: 'Family Physician',
      status: 'active',
    },
    {
      id: 'st-4',
      full_name: 'Sara Qureshi',
      email: 'reception@alshifaclinic.pk',
      phone: '+92 312 9988112',
      role: 'receptionist',
      designation: 'Head Receptionist & Patient CRM',
      status: 'active',
    },
    {
      id: 'st-5',
      full_name: 'Muhammad Imran',
      email: 'cashier@alshifaclinic.pk',
      phone: '+92 345 6677889',
      role: 'cashier',
      designation: 'Lead Cashier & Billing Officer',
      status: 'active',
    },
    {
      id: 'st-6',
      full_name: 'Zeeshan Akhtar',
      email: 'pharmacy@alshifaclinic.pk',
      phone: '+92 331 4455223',
      role: 'pharmacist',
      designation: 'Senior Dispensing Pharmacist',
      status: 'active',
    },
    {
      id: 'st-7',
      full_name: 'Rashid Kamal',
      email: 'accounts@alshifaclinic.pk',
      phone: '+92 300 8899776',
      role: 'accountant',
      designation: 'Financial Accountant & Controller',
      status: 'active',
    },
  ]);

  const toggleStatus = (id: string) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s))
    );
  };

  const filtered = staff.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.role.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-teal-600" />
            Staff Accounts & Role-Based Permissions (RBAC)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage authenticated users across 7 distinct clinical, financial, and operational roles
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search staff by name, email, or role..."
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Work Email & Phone</th>
                <th className="py-3.5 px-4">Designation</th>
                <th className="py-3.5 px-4">Assigned Role</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {s.full_name}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-700">{s.email}</div>
                    <div className="text-[10px] text-slate-400">{s.phone}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {s.designation}
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="primary" className="capitalize text-[10px]">
                      {s.role.replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={s.status === 'active' ? 'success' : 'default'} className="capitalize text-[10px]">
                      {s.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleStatus(s.id)}
                      className="text-xs h-7 text-slate-600 hover:text-slate-900"
                    >
                      {s.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
