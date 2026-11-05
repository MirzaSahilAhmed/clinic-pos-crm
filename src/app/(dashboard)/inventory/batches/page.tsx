'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Layers,
  ArrowLeft,
  Search,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatDate } from '@/lib/utils';
import { SEED_BATCHES, SEED_PRODUCTS } from '@/services/clinic-service';

export default function BatchesExpiryPage() {
  const [search, setSearch] = React.useState('');

  const enrichedBatches = SEED_BATCHES.map((b) => {
    const prod = SEED_PRODUCTS.find((p) => p.id === b.product_id);
    const expiry = new Date(b.expiry_date);
    const today = new Date();
    const diffMonths = (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
    const isExpired = expiry < today;
    const isNearExpiry = !isExpired && diffMonths <= 6;

    return {
      ...b,
      product_name: prod?.name || 'Medical Product',
      isExpired,
      isNearExpiry,
    };
  });

  const filtered = enrichedBatches.filter(
    (b) =>
      b.batch_number.toLowerCase().includes(search.toLowerCase()) ||
      b.product_name.toLowerCase().includes(search.toLowerCase())
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
              <Clock className="w-6 h-6 text-teal-600" />
              Medicine Batches & Expiry Tracking (FEFO)
            </h1 >
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Batch lot verification, shelf-life monitoring, and first-expiry first-out enforcement
            </p>
          </div>
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
              placeholder="Search by Batch Lot # or Product Name..."
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
                <th className="py-3.5 px-4">Batch Lot #</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4 text-center">Initial Stock</th>
                <th className="py-3.5 px-4 text-center">Remaining Quantity</th>
                <th className="py-3.5 px-4 text-right">Cost Price</th>
                <th className="py-3.5 px-4 text-center">Shelf Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-teal-800">
                    {b.batch_number}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {b.product_name}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {formatDate(b.expiry_date)}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-500">
                    {b.initial_quantity}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-900 text-sm">
                    {b.current_quantity}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-700">
                    {formatCurrency(b.purchase_price)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {b.isExpired ? (
                      <Badge variant="danger" className="text-[10px]">Expired</Badge>
                    ) : b.isNearExpiry ? (
                      <Badge variant="warning" className="text-[10px]">Expiring Soon</Badge>
                    ) : (
                      <Badge variant="success" className="text-[10px]">Valid Shelf-Life</Badge>
                    )}
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
