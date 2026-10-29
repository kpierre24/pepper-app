import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  Edit2,
  Trash2,
  DollarSign,
  TrendingUp,
  Package,
} from 'lucide-react';

export const OrdersList: React.FC = () => {
  const {
    orders,
    setIsNewOrderModalOpen,
    updateOrderStatus,
    fulfillOrder,
    deleteOrder,
    setViewingInvoiceOrder,
    setEditingOrder,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      if (statusFilter !== 'all' && ord.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesNumber = ord.orderNumber.toLowerCase().includes(query);
        const matchesCustomer = ord.customerName.toLowerCase().includes(query);
        const matchesItems = ord.items.some((i) => i.productName.toLowerCase().includes(query));
        const matchesCity = ord.deliveryAddress.toLowerCase().includes(query);
        return matchesNumber || matchesCustomer || matchesItems || matchesCity;
      }
      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Aggregate stats for filtered view
  const filteredStats = useMemo(() => {
    const totalRev = filteredOrders.reduce((sum, o) => sum + o.total, 0);
    const totalCost = filteredOrders.reduce((sum, o) => sum + o.totalProductionCost, 0);
    const totalProfit = filteredOrders.reduce((sum, o) => sum + o.totalGrossProfit, 0);
    const totalBottles = filteredOrders.reduce(
      (sum, o) => sum + o.items.reduce((iSum, i) => iSum + i.quantity, 0),
      0
    );
    const margin = totalRev > 0 ? (totalProfit / totalRev) * 100 : 0;
    return { totalRev, totalCost, totalProfit, totalBottles, margin };
  }, [filteredOrders]);

  const handleDelete = (order: Order) => {
    if (window.confirm(`Are you sure you want to delete order ${order.orderNumber} for ${order.customerName}?`)) {
      deleteOrder(order.id);
    }
  };

  const statusCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      in_production: orders.filter((o) => o.status === 'in_production').length,
      ready: orders.filter((o) => o.status === 'ready').length,
      fulfilled: orders.filter((o) => o.status === 'fulfilled').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  }, [orders]);

  return (
    <div className="space-y-6">
      {/* Header & New Order Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-100 text-amber-800 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <h2 className="font-serif-brand text-2xl font-bold text-stone-900">
              Orders Management & Collation
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Track customer orders, monitor production cost per shipment, and fulfill deliveries.
          </p>
        </div>

        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md border border-red-400/40 cursor-pointer self-start sm:self-auto transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Order</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 text-xs font-medium">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-stone-900 text-white font-bold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All ({statusCounts.all})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Pending ({statusCounts.pending})
            </button>
            <button
              onClick={() => setStatusFilter('in_production')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'in_production'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              In Production ({statusCounts.in_production})
            </button>
            <button
              onClick={() => setStatusFilter('ready')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'ready'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Ready ({statusCounts.ready})
            </button>
            <button
              onClick={() => setStatusFilter('fulfilled')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'fulfilled'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Fulfilled ({statusCounts.fulfilled})
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                statusFilter === 'cancelled'
                  ? 'bg-stone-500 text-white font-bold'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              Cancelled ({statusCounts.cancelled})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search order #, customer, sauce..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Live Filter Bar Stats */}
        <div className="pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-stone-600">
          <div>
            Showing: <strong className="text-stone-900">{filteredOrders.length} orders</strong> ({filteredStats.totalBottles} bottles)
          </div>
          <div>
            Revenue: <strong className="text-stone-900 font-mono-numbers">${filteredStats.totalRev.toFixed(2)}</strong>
          </div>
          <div>
            Cost: <strong className="text-stone-700 font-mono-numbers">${filteredStats.totalCost.toFixed(2)}</strong>
          </div>
          <div>
            Gross Profit: <strong className="text-emerald-700 font-mono-numbers">+${filteredStats.totalProfit.toFixed(2)}</strong> ({filteredStats.margin.toFixed(0)}%)
          </div>
        </div>
      </div>

      {/* Orders List Cards */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-stone-200">
          <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-stone-700 font-bold text-base">No orders found</h3>
          <p className="text-xs text-stone-500 mt-1">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const totalBottles = ord.items.reduce((s, i) => s + i.quantity, 0);

            return (
              <div
                key={ord.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono-numbers text-base font-bold text-stone-900 bg-amber-50 border border-amber-200 text-amber-950 px-2.5 py-0.5 rounded-lg">
                      {ord.orderNumber}
                    </span>
                    <h3 className="font-bold text-stone-900 text-sm">{ord.customerName}</h3>
                    <span className="text-xs text-stone-500">{ord.customerPhone}</span>
                    <span className="text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                      {ord.deliveryMethod.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        ord.paymentStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.paymentStatus === 'cod'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ord.paymentStatus === 'paid' ? 'Paid' : ord.paymentStatus === 'cod' ? 'Cash on Delivery' : 'Unpaid'}
                    </span>
                  </div>

                  {/* Actions & Status Control */}
                  <div className="flex items-center gap-2">
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border cursor-pointer ${
                        ord.status === 'fulfilled'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : ord.status === 'ready'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : ord.status === 'in_production'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : ord.status === 'cancelled'
                          ? 'bg-stone-100 text-stone-600 border-stone-300'
                          : 'bg-red-50 text-red-800 border-red-300'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_production">In Production</option>
                      <option value="ready">Ready / Packed</option>
                      <option value="fulfilled">Fulfilled</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    {ord.status !== 'fulfilled' && ord.status !== 'cancelled' && (
                      <button
                        onClick={() => fulfillOrder(ord.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Fulfill</span>
                      </button>
                    )}

                    <button
                      onClick={() => setViewingInvoiceOrder(ord)}
                      className="p-1.5 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                      title="Invoice / Slip"
                    >
                      <Printer className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setEditingOrder(ord)}
                      className="p-1.5 text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                      title="Edit order"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(ord)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Items & Financial Details */}
                <div className="py-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Items list */}
                  <div className="md:col-span-2 space-y-1.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      Ordered Sauces ({totalBottles} bottles)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ord.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs bg-stone-50 p-2 rounded-lg border border-stone-100"
                        >
                          <div className="truncate pr-2">
                            <span className="font-bold text-amber-950 font-mono-numbers">
                              {item.quantity}x
                            </span>{' '}
                            <span className="font-medium text-stone-800">{item.productName}</span>
                            <span className="text-[10px] text-stone-500 block">
                              {item.bottleSize}
                            </span>
                          </div>
                          <div className="text-right flex-shrink-0 font-mono-numbers">
                            <span className="font-bold text-stone-900">${item.subtotal.toFixed(2)}</span>
                            <span className="text-[10px] text-emerald-700 block">
                              +${item.subtotalProfit.toFixed(2)} profit
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {ord.notes && (
                      <div className="text-xs text-stone-500 italic bg-amber-50/60 p-2 rounded border border-amber-100 mt-2">
                        Note: {ord.notes}
                      </div>
                    )}
                  </div>

                  {/* Financial breakdown card */}
                  <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/80 flex flex-col justify-between text-xs space-y-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-stone-600">
                        <span>Items Subtotal:</span>
                        <span className="font-mono-numbers font-medium">${ord.subtotal.toFixed(2)}</span>
                      </div>
                      {ord.discount > 0 && (
                        <div className="flex justify-between text-red-600">
                          <span>Discount:</span>
                          <span className="font-mono-numbers">-${ord.discount.toFixed(2)}</span>
                        </div>
                      )}
                      {ord.deliveryFee > 0 && (
                        <div className="flex justify-between text-stone-600">
                          <span>Delivery Fee:</span>
                          <span className="font-mono-numbers">+${ord.deliveryFee.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-stone-900 font-bold border-t border-stone-200 pt-1 text-sm">
                        <span>Order Total:</span>
                        <span className="font-mono-numbers">${ord.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-stone-200 space-y-1">
                      <div className="flex justify-between text-stone-500 text-[11px]">
                        <span>Production Cost:</span>
                        <span className="font-mono-numbers">${ord.totalProductionCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-800 font-bold text-xs">
                        <span>Gross Profit:</span>
                        <span className="font-mono-numbers">+${ord.totalGrossProfit.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-stone-500 text-[11px]">
                        <span>Profit Margin:</span>
                        <span className="font-bold text-emerald-700 font-mono-numbers">
                          {ord.profitMarginPercent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer timestamp & address */}
                <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between text-[11px] text-stone-400">
                  <div className="flex items-center gap-3">
                    <span>Placed: {new Date(ord.createdAt).toLocaleDateString()}</span>
                    {ord.dueDate && <span>Due by: <strong className="text-amber-800">{ord.dueDate}</strong></span>}
                    {ord.fulfilledAt && <span>Fulfilled: {new Date(ord.fulfilledAt).toLocaleDateString()}</span>}
                  </div>
                  <div>Delivery: {ord.deliveryAddress}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
