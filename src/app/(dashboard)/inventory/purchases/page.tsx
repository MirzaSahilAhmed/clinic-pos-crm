'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Truck,
  ArrowLeft,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Building2,
  Boxes,
  FileText,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { formatCurrency, formatDate } from '@/lib/utils';
import { SEED_PRODUCTS } from '@/services/clinic-service';

export default function PurchasesPage() {
  const [showPOModal, setShowPOModal] = React.useState(false);
  const [purchases, setPurchases] = React.useState([
    {
      id: 'po-1',
      po_number: 'PO-2026-001',
      supplier: 'MediPharm Distribution',
      date: '2026-11-01',
      items_summary: 'Panadol 500mg (400 tabs), Augmentin 625mg (150 tabs)',
      total_amount: 6200,
      payment_status: 'paid',
    },
    {
      id: 'po-2',
      po_number: 'PO-2026-002',
      supplier: 'Alliance Medical Supplies',
      date: '2026-11-03',
      items_summary: 'Disposable Syringes 5ml (300 pcs), Sterile Gauze',
      total_amount: 18500,
      payment_status: 'paid',
    },
  ]);

  // New PO form state
  const [supplierName, setSupplierName] = React.useState('MediPharm Distribution');
  const [productId, setProductId] = React.useState(SEED_PRODUCTS[0].id);
  const [batchNum, setBatchNum] = React.useState('B-NEW-2026');
  const [expiryDate, setExpiryDate] = React.useState('2028-12-31');
  const [quantity, setQuantity] = React.useState('100');
  const [unitCost, setUnitCost] = React.useState('3.5');
  const [loading, setLoading] = React.useState(false);

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const prod = SEED_PRODUCTS.find((p) => p.id === productId);
    const total = (parseFloat(quantity) || 0) * (parseFloat(unitCost) || 0);

    const newPO = {
      id: 'po-' + Date.now(),
      po_number: `PO-2026-00${purchases.length + 1}`,
      supplier: supplierName,
      date: new Date().toISOString().split('T')[0],
      items_summary: `${prod?.name || 'Stock Item'} (${quantity} units)`,
      total_amount: total,
      payment_status: 'paid',
    };

    setPurchases([newPO, ...purchases]);
    setLoading(false);
    setShowPOModal(false);
  };

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
              Supplier Purchases & Stock Intake
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Goods received notes (GRN), inventory batch creation, and procurement receipts
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowPOModal(true)}
          className="bg-teal-600 hover:bg-teal-700 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Record Stock Intake
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">PO / GRN #</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4">Date Received</th>
                <th className="py-3.5 px-4">Items & Batch Intake</th>
                <th className="py-3.5 px-4 text-right">Total Invoice</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchases.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">{po.po_number}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{po.supplier}</td>
                  <td className="py-3 px-4 text-slate-600">{formatDate(po.date)}</td>
                  <td className="py-3 px-4 text-slate-700">{po.items_summary}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 text-sm">
                    {formatCurrency(po.total_amount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant="success" className="text-[10px] capitalize">{po.payment_status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Record Stock Intake Dialog */}
      {showPOModal && (
        <Dialog open={showPOModal} onOpenChange={setShowPOModal}>
          <DialogHeader>
            <DialogTitle>Record Pharmaceutical Stock Intake</DialogTitle>
            <DialogClose onClose={() => setShowPOModal(false)} />
          </DialogHeader>
          <form onSubmit={handleCreatePO}>
            <DialogContent className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Distributor / Supplier *</label>
                <Select
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                >
                  <option value="MediPharm Distribution">MediPharm Distribution (GSK Authorized)</option>
                  <option value="Searle Pharma Direct">Searle Pharma Direct</option>
                  <option value="Alliance Medical Supplies">Alliance Medical Supplies</option>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Product / Medicine *</label>
                <Select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                >
                  {SEED_PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.brand})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Batch Lot Number *</label>
                  <Input
                    required
                    value={batchNum}
                    onChange={(e) => setBatchNum(e.target.value)}
                    placeholder="e.g. B-PAN-441"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Expiry Date *</label>
                  <Input
                    type="date"
                    required
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Intake Quantity *</label>
                  <Input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Unit Cost (₨) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={unitCost}
                    onChange={(e) => setUnitCost(e.target.value)}
                  />
                </div>
              </div>
            </DialogContent>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowPOModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" isLoading={loading} className="bg-teal-600 hover:bg-teal-700">
                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Confirm Intake & Increment Stock
              </Button>
            </DialogFooter>
          </form>
        </Dialog>
      )}
    </div>
  );
}
