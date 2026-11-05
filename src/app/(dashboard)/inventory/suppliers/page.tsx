'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Truck,
  ArrowLeft,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Building2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function SuppliersPage() {
  const [search, setSearch] = React.useState('');

  const suppliers = [
    {
      id: 'sup-1',
      name: 'MediPharm Distribution',
      company: 'MediPharm Pakistan Pvt Ltd',
      phone: '+92 21 34991122',
      email: 'orders@medipharm.pk',
      address: 'Korangi Industrial Area, Karachi',
      notes: 'Official authorized GSK distributor',
      status: 'active',
    },
    {
      id: 'sup-2',
      name: 'Searle Pharma Direct',
      company: 'The Searle Company Limited',
      phone: '+92 21 35055000',
      email: 'supplies@searle.com.pk',
      address: 'SITE Industrial Estate, Karachi',
      notes: 'Direct manufacturer supply terms',
      status: 'active',
    },
    {
      id: 'sup-3',
      name: 'Alliance Medical Supplies',
      company: 'Alliance Healthcare Traders',
      phone: '+92 300 9283741',
      email: 'sales@alliancemedical.pk',
      address: 'Tariq Road Medical Plaza, Karachi',
      notes: 'Syringes, surgical consumables, PPE vendor',
      status: 'active',
    },
  ];

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/inventory">
            <Button size="icon" variant="outline" className="h-9 w-9">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Truck className="w-6 h-6 text-teal-600" />
              Pharmaceutical Suppliers & Vendors
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Distributor contacts, trade terms, and procurement partnerships
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <Card key={s.id} className="hover:border-teal-300 transition-colors bg-white">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{s.company}</span>
                <Badge variant="success" className="text-[10px] capitalize">{s.status}</Badge>
              </div>

              <div className="text-xs text-slate-500 font-medium">Rep: {s.name}</div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>{s.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{s.address}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic pt-1">{s.notes}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
