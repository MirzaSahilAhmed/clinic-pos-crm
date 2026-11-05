'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  Search,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils';
import { ClinicService, SEED_SERVICES } from '@/services/clinic-service';
import { Service } from '@/types/database.types';

export default function ServicesPricingPage() {
  const [services, setServices] = React.useState<Service[]>(SEED_SERVICES);
  const [search, setSearch] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);

  // New Service Form State
  const [name, setName] = React.useState('');
  const [code, setCode] = React.useState('');
  const [category, setCategory] = React.useState('Consultation');
  const [price, setPrice] = React.useState('');
  const [duration, setDuration] = React.useState('20');

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newService: Service = {
      id: 'srv-' + Date.now(),
      clinic_id: '11111111-1111-1111-1111-111111111111',
      code: code || `SRV-00${services.length + 1}`,
      name,
      category,
      price: parseFloat(price) || 0,
      tax_rate: 0,
      duration_minutes: parseInt(duration, 10) || 20,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setServices([...services, newService]);
    setShowModal(false);
    setName('');
    setPrice('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-teal-600" />
            Clinical Services & Tariff Pricing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure consultation fees, lab procedures, and diagnostic service prices
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowModal(true)}
          className="bg-teal-600 hover:bg-teal-700 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add New Service
        </Button>
      </div>

      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center gap-2 text-xs">
        <AlertCircle className="w-4 h-4 text-teal-600 shrink-0" />
        <span>
          <strong>Snapshot Pricing Guarantee:</strong> Completed invoices store immutable price snapshots; changing prices here will not modify past bills.
        </span>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Service Name & Description</th>
                <th className="py-3.5 px-4">Department / Category</th>
                <th className="py-3.5 px-4 text-center">Duration</th>
                <th className="py-3.5 px-4 text-right">Standard Fee (PKR)</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">{s.code || '-'}</td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{s.name}</div>
                    <div className="text-[10px] text-slate-400">{s.description || 'Routine service'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-[10px]">{s.category}</Badge>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-600">
                    {s.duration_minutes} mins
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 text-sm">
                    {formatCurrency(s.price)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={s.is_active ? 'success' : 'default'} className="text-[10px]">
                      {s.is_active ? 'Active' : 'Disabled'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Service Dialog */}
      {showModal && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogHeader>
            <DialogTitle>Add Clinical Service / Procedure</DialogTitle>
            <DialogClose onClose={() => setShowModal(false)} />
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <DialogContent className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Service Name *</label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Echocardiogram, Wound Suture, HbA1c Test"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Service Code</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. SRV-009"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Laboratory">Laboratory & Diagnostics</option>
                    <option value="Specialized">Specialized Procedure</option>
                    <option value="Dental">Dental Care</option>
                    <option value="Nursing">Nursing / Dressing</option>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Price (PKR) *</label>
                  <Input
                    type="number"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 2500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Duration (Minutes)</label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="20"
                  />
                </div>
              </div>
            </DialogContent>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
                Save Service & Pricing
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      )}
    </div>
  );
}
