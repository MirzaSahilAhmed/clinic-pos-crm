'use client';

import * as React from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  User,
  Clock,
  Activity,
  Calendar,
  Lock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';

export default function AuditLogsPage() {
  const [search, setSearch] = React.useState('');

  const logs = [
    {
      id: 'log-1',
      action: 'COMPLETE_SALE',
      module: 'POS & Billing',
      user: 'Muhammad Imran (Cashier)',
      description: 'Processed POS Sale INV-2026-000001 (₨4,000) for patient Muhammad Farooq.',
      timestamp: '2026-11-05 15:42:10',
      ip: '192.168.1.45',
    },
    {
      id: 'log-2',
      action: 'WRITE_PRESCRIPTION',
      module: 'Clinical',
      user: 'Dr. Tariq Mahmood (Doctor)',
      description: 'Prescribed 2 medications on RX-2026-0001 for patient Muhammad Farooq.',
      timestamp: '2026-11-05 15:35:20',
      ip: '192.168.1.12',
    },
    {
      id: 'log-3',
      action: 'UPDATE_CLINIC_SETTINGS',
      module: 'Management',
      user: 'Dr. Tariq Mahmood (Super Admin)',
      description: 'Updated clinic tax rate and default working hours.',
      timestamp: '2026-11-04 18:20:00',
      ip: '192.168.1.10',
    },
    {
      id: 'log-4',
      action: 'STOCK_INTAKE',
      module: 'Inventory',
      user: 'Zeeshan Akhtar (Pharmacist)',
      description: 'Stock intake PO-2026-001 (Panadol 400 tablets, Augmentin 150 tablets).',
      timestamp: '2026-11-04 11:10:05',
      ip: '192.168.1.30',
    },
    {
      id: 'log-5',
      action: 'REGISTER_PATIENT',
      module: 'Patients CRM',
      user: 'Sara Qureshi (Receptionist)',
      description: 'Registered patient Fatima Zahra (MRN: PAT-2026-0002).',
      timestamp: '2026-11-03 09:15:30',
      ip: '192.168.1.20',
    },
  ];

  const filtered = logs.filter(
    (l) =>
      l.description.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-600" />
            Security & Compliance Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Immutable log of clinical records modifications, financial tenders, and system access
          </p>
        </div>

        <Badge variant="outline" className="border-teal-300 text-teal-800 text-xs px-3 py-1">
          <Lock className="w-3.5 h-3.5 mr-1" /> Append-Only Log
        </Badge>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail by user, action, or description..."
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="divide-y divide-slate-100 text-xs">
          {filtered.map((log) => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="primary" className="font-mono text-[9px]">
                    {log.action}
                  </Badge>
                  <span className="font-bold text-slate-800 text-xs">{log.module}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500 font-medium">{log.user}</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-normal">{log.description}</p>
                <div className="text-[10px] text-slate-400">
                  IP: {log.ip} • Station: Clifton Branch LAN
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className="text-[11px] font-mono text-slate-500">{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
