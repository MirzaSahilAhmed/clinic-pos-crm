'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  HeartHandshake,
  Search,
  Plus,
  Phone,
  Mail,
  UserCheck,
  Calendar,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';
import { ClinicService, SEED_LEADS } from '@/services/clinic-service';
import { Lead } from '@/types/database.types';

export default function LeadsPipelinePage() {
  const [leads, setLeads] = React.useState<Lead[]>(SEED_LEADS);
  const [search, setSearch] = React.useState('');
  const [showNewLeadModal, setShowNewLeadModal] = React.useState(false);

  // New Lead Form State
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [service, setService] = React.useState('Executive Health Checkup');
  const [source, setSource] = React.useState('WhatsApp');
  const [notes, setNotes] = React.useState('');

  const filtered = leads.filter(
    (l) =>
      l.full_name.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      (l.service_interested && l.service_interested.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: Lead = {
      id: 'lead-' + Date.now(),
      clinic_id: '11111111-1111-1111-1111-111111111111',
      full_name: name,
      phone,
      source,
      service_interested: service,
      inquiry_date: new Date().toISOString().split('T')[0],
      status: 'new',
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setLeads([newLead, ...leads]);
    setShowNewLeadModal(false);
    setName('');
    setPhone('');
  };

  const handleConvertLead = (lead: Lead) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, status: 'converted' } : l))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <HeartHandshake className="w-6 h-6 text-teal-600" />
            CRM Inquiries & Leads Pipeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Capture inquiries from Google, WhatsApp & Social, and convert directly to patient charts
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowNewLeadModal(true)}
          className="bg-teal-600 hover:bg-teal-700 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add New Lead
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads by name, phone, or interested service..."
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((lead) => {
          const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
          const waUrl = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(lead.full_name)},%20this%20is%20Al-Shifa%20Clinic%20following%20up%20on%20your%20inquiry.`;

          return (
            <Card key={lead.id} className="hover:border-teal-300 transition-colors bg-white">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={lead.status === 'converted' ? 'success' : lead.status === 'contacted' ? 'info' : 'warning'} className="capitalize text-[10px]">
                    {lead.status.replace('_', ' ')}
                  </Badge>
                  <span className="text-[11px] text-slate-400">{formatDate(lead.inquiry_date)}</span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900">{lead.full_name}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>{lead.phone}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs space-y-1">
                  <span className="text-slate-400 text-[10px] block font-semibold uppercase">Interested Service</span>
                  <div className="font-semibold text-slate-800">{lead.service_interested}</div>
                  <div className="text-slate-500 italic text-[11px] mt-1">{lead.notes}</div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link href={waUrl} target="_blank">
                    <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700 h-8 px-2.5 text-xs">
                      <MessageSquare className="w-3.5 h-3.5 mr-1" /> WhatsApp
                    </Button>
                  </Link>

                  {lead.status !== 'converted' ? (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleConvertLead(lead)}
                      className="bg-teal-600 hover:bg-teal-700 h-8 text-xs"
                    >
                      <UserCheck className="w-3.5 h-3.5 mr-1" /> Convert to Patient
                    </Button>
                  ) : (
                    <span className="text-emerald-600 font-semibold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Converted
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* New Lead Dialog */}
      {showNewLeadModal && (
        <Dialog open={showNewLeadModal} onOpenChange={setShowNewLeadModal}>
          <DialogHeader>
            <DialogTitle>Capture Patient Lead / Inquiry</DialogTitle>
            <DialogClose onClose={() => setShowNewLeadModal(false)} />
          </DialogHeader>
          <form onSubmit={handleCreateLead}>
            <DialogContent className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Inquirer Full Name *</label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asad Siddiqui"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
                <Input
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300 1234567"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Service Interested In</label>
                  <Input
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    placeholder="e.g. Cardiology checkup"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Source</label>
                  <Select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                  >
                    <option value="WhatsApp">WhatsApp Inquiry</option>
                    <option value="Google Search">Google Maps / Search</option>
                    <option value="Facebook / Instagram">Social Media</option>
                    <option value="Phone Call">Phone Inbound</option>
                    <option value="Walk-in">Walk-in Inquiry</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Inquiry Notes</label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Patient asked about fee and doctor availability"
                />
              </div>
            </DialogContent>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowNewLeadModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" className="bg-teal-600 hover:bg-teal-700">
                Save Inbound Lead
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      )}
    </div>
  );
}
