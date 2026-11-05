'use client';

import * as React from 'react';
import {
  Settings,
  Building2,
  Globe,
  Receipt,
  Calendar,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, Textarea } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ClinicService, SEED_SETTINGS } from '@/services/clinic-service';
import { ClinicSettings } from '@/types/database.types';

export default function ClinicSettingsPage() {
  const [settings, setSettings] = React.useState<ClinicSettings>(SEED_SETTINGS);
  const [savedSuccess, setSavedSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleModuleToggle = (moduleKey: keyof ClinicSettings['enabled_modules']) => {
    setSettings((prev) => ({
      ...prev,
      enabled_modules: {
        ...prev.enabled_modules,
        [moduleKey]: !prev.enabled_modules[moduleKey],
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-teal-600" />
            Clinic Master Configuration & SaaS Modules
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Regional Pakistani standards, operational hours, branding, and modular feature toggles
          </p>
        </div>

        {savedSuccess && (
          <Badge variant="success" className="text-xs flex items-center gap-1.5 py-1 px-3">
            <CheckCircle2 className="w-4 h-4" /> Settings Saved!
          </Badge>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* 1. Clinic Facility Identity */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <Building2 className="w-4 h-4 text-teal-600" /> 1. Clinic Branding & Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Official Clinic Name *</label>
                <Input
                  required
                  value={settings.clinic_name}
                  onChange={(e) => setSettings({ ...settings, clinic_name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Medical Registration # (PMC / PHC)</label>
                <Input
                  value={settings.registration_no || ''}
                  onChange={(e) => setSettings({ ...settings, registration_no: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Phone Hotline *</label>
                <Input
                  value={settings.phone || ''}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Contact Email</label>
                <Input
                  value={settings.email || ''}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">City</label>
                <Input
                  value={settings.city || ''}
                  onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Clinic Street Address</label>
              <Input
                value={settings.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* 2. Regional Localization (Pakistan Defaults) */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <Globe className="w-4 h-4 text-sky-600" /> 2. Regional & Currency Localization
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Currency Symbol</label>
              <Input
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Timezone</label>
              <Select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              >
                <option value="Asia/Karachi">Asia/Karachi (PKT +05:00)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST +04:00)</option>
                <option value="UTC">UTC (GMT)</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Date Display Format</label>
              <Select
                value={settings.date_format}
                onChange={(e) => setSettings({ ...settings, date_format: e.target.value })}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY (UK / PK)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Primary UI Language</label>
              <Select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              >
                <option value="en">English</option>
                <option value="ur">Urdu (اردو)</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 3. POS Billing & Invoicing Parameters */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <Receipt className="w-4 h-4 text-emerald-600" /> 3. POS Billing & Invoice Defaults
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Invoice Number Prefix</label>
                <Input
                  value={settings.invoice_prefix}
                  onChange={(e) => setSettings({ ...settings, invoice_prefix: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Default Sales Tax (%)</label>
                <Input
                  type="number"
                  value={settings.default_tax_rate}
                  onChange={(e) => setSettings({ ...settings, default_tax_rate: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Default Slot Duration (Mins)</label>
                <Input
                  type="number"
                  value={settings.default_slot_duration}
                  onChange={(e) => setSettings({ ...settings, default_slot_duration: parseInt(e.target.value, 10) || 20 })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Printable Invoice Footer Message</label>
              <Textarea
                value={settings.invoice_footer || ''}
                onChange={(e) => setSettings({ ...settings, invoice_footer: e.target.value })}
                className="min-h-[60px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* 4. Modular SaaS Feature Controls */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <Sparkles className="w-4 h-4 text-indigo-600" /> 4. Modular SaaS Feature Activation
            </CardTitle>
            <CardDescription className="text-xs">
              Enable or disable optional operational modules for this clinic deployment
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'pharmacy', label: 'Pharmacy & Drug Dispensing', desc: 'Enable batch-level medicine sales in POS' },
              { key: 'inventory', label: 'Stock & Inventory Management', desc: 'Manage warehouse batches, suppliers and purchase orders' },
              { key: 'crm_leads', label: 'CRM Leads & Patient Pipeline', desc: 'Inquiry funnel and 1-click lead conversion' },
              { key: 'expenses', label: 'Financial Expense Vouchers', desc: 'Disbursements and clinic operating overhead tracking' },
              { key: 'prescriptions', label: 'Electronic Prescriptions (e-Rx)', desc: 'Multi-dose prescription builder and print templates' },
              { key: 'advanced_reports', label: 'Advanced Analytics & Reports', desc: 'Doctor contribution and tender revenue analytics' },
            ].map((mod) => {
              const isEnabled = settings.enabled_modules[mod.key as keyof ClinicSettings['enabled_modules']];
              return (
                <div
                  key={mod.key}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900">{mod.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{mod.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleModuleToggle(mod.key as any)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      isEnabled ? 'bg-teal-600' : 'bg-slate-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        isEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </CardContent>
          <CardFooter className="flex items-center justify-end p-4 bg-slate-50/50">
            <Button type="submit" variant="primary" size="md" isLoading={loading} className="bg-teal-600 hover:bg-teal-700">
              <CheckCircle2 className="w-4 h-4 mr-1.5" /> Save Clinic Settings
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
