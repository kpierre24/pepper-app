import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeliveryMethod } from '../types';
import {
  Layers,
  ChefHat,
  PackageCheck,
  Printer,
  CheckCircle2,
  AlertCircle,
  Truck,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Trash2,
} from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';

export const OrderCollationView: React.FC = () => {
  const {
    orders,
    products,
    pendingCollation,
    updateOrderStatus,
    fulfillOrder,
    batchUpdateOrderStatus,
    setViewingInvoiceOrder,
    deleteOrder,
  } = useApp();

  const [orderToDelete, setOrderToDelete] = useState<any | null>(null);

  const [deliveryFilter, setDeliveryFilter] = useState<'all' | DeliveryMethod>('all');
  const [packedItems, setPackedItems] = useState<Record<string, boolean>>({});

  // Active orders that need fulfillment
  const activeOrders = orders
    .filter((o) => o.status === 'pending' || o.status === 'in_production' || o.status === 'ready')
    .filter((o) => (deliveryFilter === 'all' ? true : o.deliveryMethod === deliveryFilter));

  const totalBottlesToPack = pendingCollation.reduce((acc, c) => acc + c.totalBottlesOrdered, 0);
  const totalStockDeficit = pendingCollation.reduce((acc, c) => acc + c.stockDeficit, 0);
  const totalPendingValue = activeOrders.reduce((acc, o) => acc + o.total, 0);
  const totalPendingProfit = activeOrders.reduce((acc, o) => acc + o.totalGrossProfit, 0);

  const togglePacked = (key: string) => {
    setPackedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBatchFulfillReady = () => {
    const readyOrders = activeOrders.filter((o) => o.status === 'ready');
    if (readyOrders.length === 0) {
      alert('No orders currently marked as "Ready". Advance pending orders to Ready once packed.');
      return;
    }
    if (window.confirm(`Mark all ${readyOrders.length} Ready orders as Fulfilled?`)) {
      readyOrders.forEach((o) => fulfillOrder(o.id));
    }
  };

  const handlePrintCollation = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Collation Header & Controls */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-red-100 text-red-700 rounded-lg">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="font-serif-brand text-2xl font-bold text-stone-900">
              Kitchen Batch Collation & Packing Center
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500">
            Real-time collation of all open customer orders. Plan bottling batches, check stock deficits, and organize packing runs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrintCollation}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold cursor-pointer border border-stone-300 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Collation Sheet</span>
          </button>

          {activeOrders.some((o) => o.status === 'ready') && (
            <button
              onClick={handleBatchFulfillReady}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-sm transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Fulfill All Ready Orders</span>
            </button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards for Collation */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-amber-950 text-amber-50 rounded-xl p-4 border border-amber-900 shadow-sm">
          <div className="text-[11px] uppercase font-bold tracking-wider text-amber-400">Total Bottles Ordered</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-numbers mt-1 text-white">
            {totalBottlesToPack} <span className="text-xs font-normal text-amber-300">bottles</span>
          </div>
          <div className="text-xs text-amber-300/80 mt-1">Across {activeOrders.length} pending orders</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
          <div className="text-[11px] uppercase font-bold tracking-wider text-stone-500">Stock Deficit to Cook</div>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono-numbers mt-1 ${totalStockDeficit > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {totalStockDeficit > 0 ? `-${totalStockDeficit}` : '0'}{' '}
            <span className="text-xs font-normal text-stone-500">bottles</span>
          </div>
          <div className="text-xs text-stone-500 mt-1">
            {totalStockDeficit > 0 ? 'Need batch brew immediately' : 'Inventory sufficient'}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
          <div className="text-[11px] uppercase font-bold tracking-wider text-stone-500">Pending Order Revenue</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-numbers mt-1 text-stone-900">
            ${totalPendingValue.toFixed(2)}
          </div>
          <div className="text-xs text-stone-500 mt-1">Awaiting dispatch/delivery</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
          <div className="text-[11px] uppercase font-bold tracking-wider text-stone-500">Expected Gross Profit</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-numbers mt-1 text-emerald-700">
            +${totalPendingProfit.toFixed(2)}
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">
            {totalPendingValue > 0 ? ((totalPendingProfit / totalPendingValue) * 100).toFixed(1) : 0}% average margin
          </div>
        </div>
      </div>

      {/* SECTION 1: Kitchen Batch Production Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-brand text-lg font-bold text-stone-900">
                1. Kitchen Bottling & Prep Matrix
              </h3>
              <p className="text-xs text-stone-500">
                Aggregated sauce counts needed across all current orders vs current storage stock.
              </p>
            </div>
          </div>
          {totalStockDeficit > 0 && (
            <span className="bg-red-100 text-red-800 text-xs font-bold px-3 py-1 rounded-full border border-red-300">
              ⚠️ Cook {totalStockDeficit} bottles to satisfy backlog
            </span>
          )}
        </div>

        {pendingCollation.length === 0 ? (
          <div className="py-8 text-center text-stone-500 text-sm">
            No pending items to collate. All orders are fulfilled!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/60 text-stone-600 uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-3">Sauce Recipe</th>
                  <th className="py-3 px-3">Size & Heat</th>
                  <th className="py-3 px-3 text-center">Needed Across Orders</th>
                  <th className="py-3 px-3 text-center">Current In-Stock</th>
                  <th className="py-3 px-3 text-center">Production Deficit</th>
                  <th className="py-3 px-3 text-right">Order Revenue</th>
                  <th className="py-3 px-3 text-right">Estimated Profit</th>
                  <th className="py-3 px-3">Order References</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {pendingCollation.map((col) => {
                  const hasDeficit = col.stockDeficit > 0;
                  return (
                    <tr
                      key={col.productId}
                      className={hasDeficit ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-stone-50/80'}
                    >
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-stone-900 text-sm">{col.productName}</div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="text-stone-700 font-medium">{col.bottleSize}</div>
                        <div className="text-red-600 text-[11px] font-bold">
                          {'🌶️'.repeat(col.heatLevel)}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-mono-numbers text-sm font-bold text-stone-900">
                          {col.totalBottlesOrdered}
                        </span>
                        <span className="text-[10px] text-stone-400 block">bottles</span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-mono-numbers text-sm font-semibold text-stone-700">
                          {col.currentStock}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {hasDeficit ? (
                          <div className="inline-flex items-center gap-1 bg-red-100 text-red-800 border border-red-300 font-bold px-2.5 py-1 rounded-full text-xs">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Cook +{col.stockDeficit}</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Stock Ready</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono-numbers font-bold text-stone-900">
                        ${col.totalExpectedRevenue.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono-numbers font-bold text-emerald-700">
                        +${col.totalExpectedProfit.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {col.orderNumbers.map((ordNum) => (
                            <span
                              key={ordNum}
                              className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.5 rounded border border-stone-200 font-mono-numbers font-medium"
                            >
                              {ordNum}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 2: Order-by-Order Packing Checklist & Run Sheet */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-brand text-lg font-bold text-stone-900">
                2. Packing Checklist & Delivery Run Sheet
              </h3>
              <p className="text-xs text-stone-500">
                Check off bottles as they are placed into crates/boxes for each customer.
              </p>
            </div>
          </div>

          {/* Delivery Method Filter */}
          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500 font-medium">Filter method:</span>
            <select
              value={deliveryFilter}
              onChange={(e) => setDeliveryFilter(e.target.value as any)}
              className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 font-medium focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">All Delivery Methods</option>
              <option value="local_delivery">Local Doorstep Delivery</option>
              <option value="pickup">Customer Pickup</option>
              <option value="shipping">Mail / Postal Shipping</option>
              <option value="market_pickup">Farmers Market Pickup</option>
            </select>
          </div>
        </div>

        {activeOrders.length === 0 ? (
          <div className="py-10 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h4 className="font-bold text-stone-800 text-sm">Packing Queue Clear</h4>
            <p className="text-xs text-stone-500 mt-1">No active orders matching this filter.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeOrders.map((ord) => {
              const allItemsChecked = ord.items.every(
                (_, idx) => packedItems[`${ord.id}-${idx}`] === true
              );

              return (
                <div
                  key={ord.id}
                  className={`rounded-xl border transition-all ${
                    allItemsChecked
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : ord.status === 'ready'
                      ? 'border-blue-300 bg-blue-50/20'
                      : 'border-stone-200 bg-white'
                  } p-4 sm:p-5`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono-numbers font-bold text-amber-950 text-base">
                        {ord.orderNumber}
                      </span>
                      <span className="text-sm font-bold text-stone-900">{ord.customerName}</span>
                      <span className="text-xs text-stone-500 hidden sm:inline">({ord.customerPhone})</span>
                      <span className="text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                        {ord.deliveryMethod.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Status Selector */}
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer ${
                          ord.status === 'ready'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : ord.status === 'in_production'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-red-100 text-red-800 border-red-300'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_production">In Production</option>
                        <option value="ready">Ready / Packed</option>
                        <option value="fulfilled">Fulfilled</option>
                      </select>

                      <button
                        onClick={() => fulfillOrder(ord.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Fulfill</span>
                      </button>

                      <button
                        onClick={() => setViewingInvoiceOrder(ord)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg cursor-pointer"
                        title="View Packing Slip"
                      >
                        Slip
                      </button>

                      <button
                        onClick={() => setOrderToDelete(ord)}
                        className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition"
                        title="Delete order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Address & Notes */}
                  <div className="py-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{ord.deliveryAddress}</span>
                    </div>
                    {ord.dueDate && (
                      <div className="flex items-center gap-1 text-amber-800 font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Due: {ord.dueDate}</span>
                      </div>
                    )}
                    {ord.notes && (
                      <div className="w-full text-stone-500 italic bg-amber-50/60 p-2 rounded mt-1 border border-amber-100">
                        Note: "{ord.notes}"
                      </div>
                    )}
                  </div>

                  {/* Items Packing Checklist */}
                  <div className="mt-3 pt-3 border-t border-stone-100 space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                      Bottle Items ({ord.items.reduce((s, i) => s + i.quantity, 0)} total):
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {ord.items.map((item, idx) => {
                        const checkKey = `${ord.id}-${idx}`;
                        const isChecked = !!packedItems[checkKey];
                        return (
                          <label
                            key={checkKey}
                            className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition ${
                              isChecked
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 line-through opacity-75'
                                : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => togglePacked(checkKey)}
                              className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="font-bold text-stone-900 font-mono-numbers">
                                {item.quantity}x
                              </span>{' '}
                              <span className="font-medium">{item.productName}</span>
                              <span className="text-[10px] text-stone-400 block">
                                {item.bottleSize}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Financials Bar */}
                  <div className="mt-3 pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 font-mono-numbers">
                    <div>
                      Order Subtotal: <strong className="text-stone-800">${ord.subtotal.toFixed(2)}</strong>
                      {ord.deliveryFee > 0 && <span> + ${ord.deliveryFee.toFixed(2)} delivery</span>}
                    </div>
                    <div className="space-x-3">
                      <span>
                        Cost: <strong>${ord.totalProductionCost.toFixed(2)}</strong>
                      </span>
                      <span className="text-emerald-700 font-bold">
                        Profit: +${ord.totalGrossProfit.toFixed(2)} ({ord.profitMarginPercent.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!orderToDelete}
        title={`Delete Order ${orderToDelete?.orderNumber || ''}`}
        message="Are you sure you want to permanently delete this order? It will be removed from your active kitchen collation and packing lists."
        confirmText="Yes, Delete Order"
        cancelText="Cancel"
        isDestructive={true}
        itemDetails={
          orderToDelete
            ? [
                { label: 'Customer', value: orderToDelete.customerName },
                {
                  label: 'Sauces to Pack',
                  value: `${orderToDelete.items.reduce((s: number, i: any) => s + i.quantity, 0)} bottles`,
                },
                { label: 'Order Total', value: `$${orderToDelete.total.toFixed(2)}` },
              ]
            : undefined
        }
        onConfirm={() => {
          if (orderToDelete) {
            deleteOrder(orderToDelete.id);
            setOrderToDelete(null);
          }
        }}
        onCancel={() => setOrderToDelete(null)}
      />
    </div>
  );
};
