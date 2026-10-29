import React from 'react';
import { useApp } from '../context/AppContext';
import {
  DollarSign,
  TrendingUp,
  Package,
  Layers,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  PieChart,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';
import { ARTISANAL_TRIO_IMAGE } from '../data/seedData';

export const DashboardOverview: React.FC = () => {
  const {
    products,
    orders,
    totalStats,
    pendingCollation,
    setActiveTab,
    setIsNewOrderModalOpen,
    setIsNewProductModalOpen,
    fulfillOrder,
    setViewingInvoiceOrder,
  } = useApp();

  const lowStockProducts = products.filter((p) => p.inventoryCount <= p.minStockAlert);
  const totalDeficitBottles = pendingCollation.reduce((acc, c) => acc + c.stockDeficit, 0);
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  // Calculate average cost breakdown across active products
  const avgCostBreakdown = products.length > 0 ? {
    peppers: products.reduce((acc, p) => acc + p.costBreakdown.peppers, 0) / products.length,
    bottleAndCap: products.reduce((acc, p) => acc + p.costBreakdown.bottleAndCap, 0) / products.length,
    label: products.reduce((acc, p) => acc + p.costBreakdown.label, 0) / products.length,
    vinegarAndSpices: products.reduce((acc, p) => acc + p.costBreakdown.vinegarAndSpices, 0) / products.length,
    laborAndOverhead: products.reduce((acc, p) => acc + p.costBreakdown.laborAndOverhead, 0) / products.length,
  } : null;

  const avgTotalCost = avgCostBreakdown
    ? avgCostBreakdown.peppers +
      avgCostBreakdown.bottleAndCap +
      avgCostBreakdown.label +
      avgCostBreakdown.vinegarAndSpices +
      avgCostBreakdown.laborAndOverhead
    : 1;

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Hero with Trio Image */}
      <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 rounded-2xl shadow-lg border border-amber-900/60 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-8 p-6 sm:p-7 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-700/50">
                  Trinidad & Tobago • Est. 2025
                </span>
                <span className="text-xs text-amber-200/80 font-medium">125 ml • $25.00 Each</span>
              </div>
              <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-amber-50">
                Welcome back, Renee
              </h2>
              <p className="font-serif-brand italic text-amber-300 text-sm mt-0.5">
                "Bold Flavours. Real Ingredients. Island Soul."
              </p>
              <p className="text-sm text-stone-300 mt-2 max-w-xl">
                Managing orders for <strong className="text-amber-200">Ginger Fire</strong>, <strong className="text-amber-200">Pineapple Blaze</strong>, and <strong className="text-amber-200">Coconut Blaze</strong>. You have{' '}
                <strong className="text-amber-300 font-semibold">{totalStats.pendingOrdersCount} active orders</strong>{' '}
                ({totalStats.pendingBottlesCount} bottles) in your collation pipeline.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                onClick={() => setActiveTab('collate')}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md border border-red-400/40 cursor-pointer transition transform active:scale-95"
              >
                <Layers className="w-4 h-4" />
                <span>Collate Kitchen Batch ({totalStats.pendingBottlesCount} bottles)</span>
              </button>
              <button
                onClick={() => setIsNewOrderModalOpen(true)}
                className="flex items-center gap-2 bg-stone-800/90 hover:bg-stone-700 text-amber-200 border border-stone-600 text-sm font-medium px-4 py-2.5 rounded-xl cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create Order</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 h-44 sm:h-52 lg:h-full relative overflow-hidden bg-stone-950 flex items-center justify-center border-t lg:border-t-0 lg:border-l border-amber-900/40">
            <img
              src={ARTISANAL_TRIO_IMAGE}
              alt="Renee's Artisanal Trio"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-3 right-3 bg-amber-400 text-stone-950 px-2.5 py-1 rounded-full text-xs font-black shadow-lg font-mono-numbers">
              $25 EACH
            </div>
          </div>
        </div>
      </div>

      {/* Stock Deficit / Alert Banner if pending orders exceed inventory */}
      {totalDeficitBottles > 0 && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Production Needed: {totalDeficitBottles} bottles needed for pending orders
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Current in-stock inventory is insufficient to pack all open orders. Review the Collation Kitchen Planner to see which recipes to brew next.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('collate')}
            className="text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-1.5 rounded-lg whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            Open Collation Plan →
          </button>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Fulfilled Sales & Revenue */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Fulfilled Revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono-numbers">
            ${totalStats.totalRevenueFulfilled.toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-stone-500 flex items-center justify-between">
            <span>Orders delivered</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {orders.filter((o) => o.status === 'fulfilled').length} completed
            </span>
          </div>
        </div>

        {/* Metric 2: Gross Profit & Margin % */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Gross Profit (Realized)</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono-numbers flex items-baseline gap-2">
            <span>${totalStats.totalProfitFulfilled.toFixed(2)}</span>
            <span className="text-sm font-bold text-emerald-600">
              {totalStats.profitMarginFulfilled.toFixed(1)}% margin
            </span>
          </div>
          <div className="mt-2 text-xs text-stone-500 flex items-center justify-between">
            <span>Production Cost:</span>
            <span className="font-medium text-stone-700 font-mono-numbers">
              ${totalStats.totalCostFulfilled.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Metric 3: Pending Order Pipeline */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Pending Pipeline</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-mono-numbers">
            ${totalStats.pendingRevenue.toFixed(2)}
          </div>
          <div className="mt-2 text-xs text-stone-500 flex items-center justify-between">
            <span>Expected Profit:</span>
            <span className="font-bold text-amber-700 font-mono-numbers">
              +${totalStats.pendingExpectedProfit.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Metric 4: Inventory Valuation & Stock */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Bottles In Stock</span>
            <div className="p-2 bg-stone-100 text-stone-700 rounded-lg">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-mono-numbers flex items-baseline gap-2">
            <span>{totalStats.inventoryTotalBottles}</span>
            <span className="text-xs font-normal text-stone-500">bottles</span>
          </div>
          <div className="mt-2 text-xs text-stone-500 flex items-center justify-between">
            <span>Retail value:</span>
            <span className="font-medium text-stone-800 font-mono-numbers">
              ${totalStats.inventoryTotalValue.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Order Collation Summary & Sauce Profitability Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Collate Queue Preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-brand text-lg font-bold text-stone-900">
                  Collation Queue (Bottles to Pack & Deliver)
                </h3>
                <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalStats.pendingOrdersCount} Active Orders
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Total bottles grouped by sauce flavor across all pending and preparing orders.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('collate')}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Collation Sheet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {pendingCollation.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-stone-700">All caught up!</p>
              <p className="text-xs text-stone-500 mt-1">No pending orders awaiting collation or bottling.</p>
              <button
                onClick={() => setIsNewOrderModalOpen(true)}
                className="mt-3 text-xs bg-amber-800 hover:bg-amber-900 text-white font-medium px-3.5 py-1.5 rounded-lg cursor-pointer"
              >
                + Add New Order
              </button>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {pendingCollation.slice(0, 5).map((item) => {
                const isShort = item.stockDeficit > 0;
                return (
                  <div key={item.productId} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-100/70 border border-amber-200 flex items-center justify-center font-bold text-amber-900 text-sm">
                        🌶️
                      </div>
                      <div>
                        <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                          {item.productName}
                          <span className="text-[11px] font-normal text-stone-500">
                            ({item.bottleSize})
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                          <span>Across {item.ordersCount} orders: {item.orderNumbers.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <div className="text-sm font-bold text-stone-900 font-mono-numbers">
                          {item.totalBottlesOrdered} <span className="text-xs font-normal text-stone-500">bottles</span>
                        </div>
                        <div className="text-xs text-stone-500">
                          Stock: <span className="font-semibold text-stone-700">{item.currentStock}</span>
                        </div>
                      </div>

                      <div className="min-w-20">
                        {isShort ? (
                          <span className="inline-block text-xs font-bold text-red-700 bg-red-100/90 border border-red-200 px-2 py-0.5 rounded-full">
                            Need +{item.stockDeficit}
                          </span>
                        ) : (
                          <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                            In Stock ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Production Cost Breakdown Anatomy */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-serif-brand text-lg font-bold text-stone-900">
                Unit Cost Anatomy
              </h3>
              <PieChart className="w-4 h-4 text-stone-400" />
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Average production cost breakdown per 5oz bottle (~${avgTotalCost.toFixed(2)} unit cost).
            </p>

            {avgCostBreakdown && (
              <div className="space-y-3">
                {/* Peppers */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-stone-700">Fresh Peppers (Bonnet, Habanero)</span>
                    <span className="font-mono-numbers font-bold text-stone-900">
                      ${avgCostBreakdown.peppers.toFixed(2)} ({((avgCostBreakdown.peppers / avgTotalCost) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full"
                      style={{ width: `${(avgCostBreakdown.peppers / avgTotalCost) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Glass Bottle & Cap */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-stone-700">Glass Woozy Bottle & Cap</span>
                    <span className="font-mono-numbers font-bold text-stone-900">
                      ${avgCostBreakdown.bottleAndCap.toFixed(2)} ({((avgCostBreakdown.bottleAndCap / avgTotalCost) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-600 rounded-full"
                      style={{ width: `${(avgCostBreakdown.bottleAndCap / avgTotalCost) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Vinyl Label */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-stone-700">Waterproof Vinyl Label</span>
                    <span className="font-mono-numbers font-bold text-stone-900">
                      ${avgCostBreakdown.label.toFixed(2)} ({((avgCostBreakdown.label / avgTotalCost) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(avgCostBreakdown.label / avgTotalCost) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Vinegar & Spices */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-stone-700">Vinegar, Garlic & Shadow Beni</span>
                    <span className="font-mono-numbers font-bold text-stone-900">
                      ${avgCostBreakdown.vinegarAndSpices.toFixed(2)} ({((avgCostBreakdown.vinegarAndSpices / avgTotalCost) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${(avgCostBreakdown.vinegarAndSpices / avgTotalCost) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Labor & Overhead */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-stone-700">Kitchen Labor & Gas/Utilities</span>
                    <span className="font-mono-numbers font-bold text-stone-900">
                      ${avgCostBreakdown.laborAndOverhead.toFixed(2)} ({((avgCostBreakdown.laborAndOverhead / avgTotalCost) * 100).toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${(avgCostBreakdown.laborAndOverhead / avgTotalCost) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('pricing_calc')}
            className="mt-5 w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold transition cursor-pointer text-center"
          >
            Open Recipe & Batch Pricing Calculator →
          </button>
        </div>
      </div>

      {/* Sauce Profitability & Margins Ranking Table */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-serif-brand text-lg font-bold text-stone-900">
              Pepper Sauce Profit Margins & Pricing
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Comparison of unit cost, retail price, wholesale price, and unit profit margin per sauce.
            </p>
          </div>
          <button
            onClick={() => setIsNewProductModalOpen(true)}
            className="text-xs font-semibold bg-stone-900 hover:bg-black text-amber-100 px-3.5 py-2 rounded-xl flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Sauce</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Sauce Product</th>
                <th className="py-2.5 px-3">Size & Heat</th>
                <th className="py-2.5 px-3 text-right">Production Cost</th>
                <th className="py-2.5 px-3 text-right">Retail Price</th>
                <th className="py-2.5 px-3 text-right">Unit Profit</th>
                <th className="py-2.5 px-3 text-right">Retail Margin</th>
                <th className="py-2.5 px-3 text-right">Wholesale Margin</th>
                <th className="py-2.5 px-3 text-center">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((prod) => {
                const unitProfitRetail = prod.retailPrice - prod.productionCost;
                const retailMarginPct = (unitProfitRetail / prod.retailPrice) * 100;
                const unitProfitWholesale = prod.wholesalePrice - prod.productionCost;
                const wholesaleMarginPct = (unitProfitWholesale / prod.wholesalePrice) * 100;
                const isLow = prod.inventoryCount <= prod.minStockAlert;

                return (
                  <tr key={prod.id} className="hover:bg-stone-50/80 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-stone-900">{prod.name}</div>
                      <div className="text-[10px] text-stone-400 font-mono-numbers">{prod.sku}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-stone-700">{prod.bottleSize}</div>
                      <div className="text-red-600 font-bold tracking-tight text-[11px]">
                        {'🌶️'.repeat(prod.heatLevel)}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono-numbers font-medium text-stone-700">
                      ${prod.productionCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-numbers font-bold text-stone-900">
                      ${prod.retailPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-numbers font-bold text-emerald-700">
                      +${unitProfitRetail.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full font-bold font-mono-numbers text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {retailMarginPct.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full font-medium font-mono-numbers text-[11px] bg-amber-50 text-amber-800 border border-amber-200">
                        {wholesaleMarginPct.toFixed(1)}% (${prod.wholesalePrice.toFixed(2)})
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-bold font-mono-numbers ${
                          isLow
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {prod.inventoryCount}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders Stream */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif-brand text-lg font-bold text-stone-900">
              Recent Orders
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage fulfillment status, view invoices, or create new client shipments.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({orders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[11px]">
                <th className="py-2 px-3">Order #</th>
                <th className="py-2 px-3">Customer</th>
                <th className="py-2 px-3">Bottles</th>
                <th className="py-2 px-3 text-right">Total</th>
                <th className="py-2 px-3 text-right">Prod. Cost</th>
                <th className="py-2 px-3 text-right">Gross Profit</th>
                <th className="py-2 px-3 text-center">Status</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.map((ord) => {
                const totalBottles = ord.items.reduce((s, i) => s + i.quantity, 0);
                return (
                  <tr key={ord.id} className="hover:bg-stone-50/70 transition">
                    <td className="py-3 px-3 font-mono-numbers font-bold text-amber-900">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-stone-900">{ord.customerName}</div>
                      <div className="text-[10px] text-stone-400 capitalize">{ord.deliveryMethod.replace('_', ' ')}</div>
                    </td>
                    <td className="py-3 px-3 font-mono-numbers text-stone-700">
                      {totalBottles} bottles
                    </td>
                    <td className="py-3 px-3 text-right font-mono-numbers font-bold text-stone-900">
                      ${ord.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-numbers text-stone-500">
                      ${ord.totalProductionCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono-numbers font-bold text-emerald-700">
                      +${ord.totalGrossProfit.toFixed(2)}{' '}
                      <span className="text-[10px] text-emerald-600 font-normal">
                        ({ord.profitMarginPercent.toFixed(0)}%)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[11px] uppercase tracking-wider ${
                          ord.status === 'fulfilled'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'ready'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'in_production'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {ord.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                      {ord.status !== 'fulfilled' && (
                        <button
                          onClick={() => fulfillOrder(ord.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer"
                          title="Mark fulfilled"
                        >
                          Fulfill ✓
                        </button>
                      )}
                      <button
                        onClick={() => setViewingInvoiceOrder(ord)}
                        className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs cursor-pointer"
                        title="Print slip"
                      >
                        Slip
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
