'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Clock,
  Search,
  Plus,
  Phone,
  MessageSquare,
  CheckCircle2,
  Calendar,
  User,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import { ClinicService, SEED_FOLLOWUPS } from '@/services/clinic-service';
import { FollowUp } from '@/types/database.types';

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = React.useState<FollowUp[]>(SEED_FOLLOWUPS);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    async function load() {
      const data = await ClinicService.getFollowUps();
      setFollowUps(data);
    }
    load();
  }, []);

  const handleMarkComplete = (id: string) => {
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'completed' } : f))
    );
  };

  const filtered = followUps.filter(
    (f) =>
      f.patient?.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (f.notes && f.notes.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-teal-600" />
            Patient Care Follow-ups & Recalls
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Post-consultation check-ins, lab result recalls, and chronic condition management
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
              placeholder="Search follow-ups by patient name or notes..."
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filtered.map((f) => {
          const cleanPhone = f.patient?.phone?.replace(/[^0-9]/g, '') || '';
          const waMsg = `Hello ${f.patient?.full_name}, this is Al-Shifa Clinic following up on your consultation with ${f.doctor?.full_name}. How are you feeling today?`;
          const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`;

          return (
            <Card key={f.id} className="hover:border-teal-300 transition-colors bg-white">
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{f.patient?.full_name}</span>
                    <Badge variant="outline" className="font-mono text-[10px]">{f.patient?.patient_mrn}</Badge>
                    <Badge variant={f.status === 'completed' ? 'success' : 'warning'} className="text-[10px] capitalize">
                      {f.status}
                    </Badge>
                  </div>

                  <div className="text-xs text-slate-600">
                    Due Date: <span className="font-bold text-slate-800">{formatDate(f.follow_up_date)}</span> • Care Doctor: {f.doctor?.full_name}
                  </div>

                  <p className="text-xs text-slate-500 pt-1 leading-relaxed">{f.notes}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={waUrl} target="_blank">
                    <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs">
                      <MessageSquare className="w-3.5 h-3.5 mr-1" /> WhatsApp Patient
                    </Button>
                  </Link>

                  {f.status !== 'completed' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleMarkComplete(f.id)}
                      className="bg-teal-600 hover:bg-teal-700 text-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mark Resolved
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
