'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  User,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import { SEED_PATIENTS } from '@/services/clinic-service';

export default function CommunicationsPage() {
  const [search, setSearch] = React.useState('');

  const logs = [
    {
      id: 'com-1',
      patient: SEED_PATIENTS[0],
      channel: 'whatsapp',
      summary: 'Follow-up regarding BP response on Concor 5mg. Patient reported blood pressure stabilized at 125/82.',
      date: '2026-11-05 14:30',
      staff: 'Front Desk / Clinic Nurse',
      outcome: 'Satisfactory symptom control',
    },
    {
      id: 'com-2',
      patient: SEED_PATIENTS[1],
      channel: 'call',
      summary: 'Called patient regarding lab culture results available for pickup.',
      date: '2026-11-05 11:15',
      staff: 'Front Desk Coordinator',
      outcome: 'Patient confirmed visiting tomorrow',
    },
    {
      id: 'com-3',
      patient: SEED_PATIENTS[3],
      channel: 'sms',
      summary: 'Automated appointment confirmation reminder for tomorrow 11:30 AM.',
      date: '2026-11-04 18:00',
      staff: 'System Automated',
      outcome: 'Delivered',
    },
  ];

  const filtered = logs.filter(
    (l) =>
      l.patient.full_name.toLowerCase().includes(search.toLowerCase()) ||
      l.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-teal-600" />
            Patient Communication History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Log of WhatsApp chats, outbound phone calls, and automated SMS appointment notifications
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
              placeholder="Search communications by patient or keyword..."
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <div className="divide-y divide-slate-100 text-xs">
          {filtered.map((log) => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{log.patient.full_name}</span>
                  <Badge variant="primary" className="uppercase text-[9px] font-mono">{log.channel}</Badge>
                  <span className="text-slate-400 text-[10px]">{log.date}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{log.summary}</p>
                <div className="text-[11px] text-slate-400 font-medium">
                  Logged by: {log.staff} • Outcome: <span className="text-teal-700 font-semibold">{log.outcome}</span>
                </div>
              </div>

              <div className="shrink-0">
                <Link href={`/patients/${log.patient.id}`}>
                  <Button size="sm" variant="outline" className="text-xs">
                    View Chart
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
