'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
  Package,
  Calendar,
  Layers,
  Truck,
  ArrowUpDown,
  TrendingDown,
  Clock,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';
import { ClinicService, SEED_PRODUCTS, SEED_BATCHES } from '@/services/clinic-service';
import { Product } from '@/types/database.types';

export default function InventoryProductsPage() {
  const [products, setProducts] = React.useState<Product[]>(SEED_PRODUCTS);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    async function load() {
      const data = await ClinicService.getProducts();
      setProducts(data);
    }
    load();
  }, []);

  const lowStockCount = products.filter((p) => p.current_stock <= p.reorder_level).length;

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.generic_name && p.generic_name.toLowerCase().includes(search.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Boxes className="w-6 h-6 text-teal-600" />
            Pharmacy & Product Inventory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Stock levels, batch expiry tracking, and procurement reorders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/inventory/batches">
            <Button variant="outline" size="sm" className="border-slate-300">
              <Clock className="w-4 h-4 mr-1.5 text-slate-600" /> Batches & Expiry
            </Button>
          </Link>
          <Link href="/inventory/purchases">
            <Button variant="outline" size="sm" className="border-slate-300">
              <Truck className="w-4 h-4 mr-1.5 text-sky-600" /> Purchase Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase">Total Catalog Items</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{products.length} Products</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase">Stock Reorder Alerts</span>
              <div className="text-2xl font-bold text-rose-600 mt-1">{lowStockCount} Low Items</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase">Active Drug Batches</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{SEED_BATCHES.length} Batches</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by brand, generic formula, or SKU..."
              className="pl-9 bg-slate-50 border-slate-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">SKU / Code</th>
                <th className="py-3.5 px-4">Product Name & Generic</th>
                <th className="py-3.5 px-4">Brand / Manufacturer</th>
                <th className="py-3.5 px-4 text-right">Purchase Cost</th>
                <th className="py-3.5 px-4 text-right">Selling Price</th>
                <th className="py-3.5 px-4 text-center">Unit</th>
                <th className="py-3.5 px-4 text-center">Stock Level</th>
                <th className="py-3.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prod) => {
                const isLow = prod.current_stock <= prod.reorder_level;
                return (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-700">
                      {prod.sku || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{prod.name}</div>
                      <div className="text-[10px] text-slate-400">{prod.generic_name}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {prod.brand || 'GSK / Local'}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-600">
                      {formatCurrency(prod.purchase_price)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(prod.selling_price)}
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-slate-600">
                      {prod.unit}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-bold text-sm ${isLow ? 'text-rose-600' : 'text-slate-800'}`}>
                        {prod.current_stock}
                      </span>
                      <span className="text-[10px] text-slate-400 block">Min: {prod.reorder_level}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isLow ? (
                        <Badge variant="danger" className="text-[10px]">Low Stock</Badge>
                      ) : (
                        <Badge variant="success" className="text-[10px]">In Stock</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
