import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Edit2,
  Trash2,
} from 'lucide-react';

export const CustomersList: React.FC = () => {
  const {
    customers,
    orders,
    setIsNewCustomerModalOpen,
    setIsNewOrderModalOpen,
    deleteCustomer,
    updateCustomer,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Compute lifetime customer stats from orders
  const customerStats = useMemo(() => {
    const map = new Map<
      string,
      { orderCount: number; totalSpent: number; totalProfit: number; lastOrderDate: string }
    >();

    orders.forEach((ord) => {
      const existing = map.get(ord.customerId) || {
        orderCount: 0,
        totalSpent: 0,
        totalProfit: 0,
        lastOrderDate: ord.createdAt,
      };

      existing.orderCount += 1;
      existing.totalSpent += ord.total;
      existing.totalProfit += ord.totalGrossProfit;
      if (new Date(ord.createdAt) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = ord.createdAt;
      }
      map.set(ord.customerId, existing);
    });

    return map;
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q)
      );
    });
  }, [customers, searchQuery]);

  const handleDelete = (cust: Customer) => {
    if (window.confirm(`Delete customer ${cust.name}? Historical orders will remain intact.`)) {
      deleteCustomer(cust.id);
    }
  };

  const startOrderForCustomer = (cust: Customer) => {
    // Open order modal
    setIsNewOrderModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-100 text-blue-800 rounded-lg">
              <Users className="w-5 h-5" />
            </span>
            <h2 className="font-serif-brand text-2xl font-bold text-stone-900">
              Customers & Wholesale Clients
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Maintain restaurant chefs, bodega buyers, and retail regulars with order history and delivery addresses.
          </p>
        </div>

        <button
          onClick={() => setIsNewCustomerModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md border border-red-400/40 cursor-pointer self-start sm:self-auto transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search customer by name, email, phone, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div className="text-xs text-stone-500 font-medium">
          Total: <strong className="text-stone-800">{customers.length} registered customers</strong>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((cust) => {
          const stats = customerStats.get(cust.id) || {
            orderCount: 0,
            totalSpent: 0,
            totalProfit: 0,
            lastOrderDate: cust.createdAt,
          };

          return (
            <div
              key={cust.id}
              className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      cust.type === 'wholesale'
                        ? 'bg-purple-100 text-purple-800 border border-purple-200'
                        : cust.type === 'subscriber'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : cust.type === 'market_stall'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-stone-100 text-stone-700 border border-stone-200'
                    }`}
                  >
                    {cust.type.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Since {cust.createdAt}
                  </span>
                </div>

                <h3 className="font-serif-brand text-lg font-bold text-stone-900 leading-snug">
                  {cust.name}
                </h3>

                {/* Contact info */}
                <div className="mt-3 space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span>{cust.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span className="truncate">{cust.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                    <span className="truncate">{cust.address}, {cust.city}</span>
                  </div>
                </div>

                {cust.notes && (
                  <p className="mt-3 text-xs text-stone-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100/70">
                    "{cust.notes}"
                  </p>
                )}

                {/* Lifetime Metrics */}
                <div className="mt-4 grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200 text-center font-mono-numbers">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Orders</span>
                    <span className="text-base font-bold text-stone-900">{stats.orderCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Spent</span>
                    <span className="text-base font-bold text-stone-900">${stats.totalSpent.toFixed(0)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Gross Profit</span>
                    <span className="text-base font-bold text-emerald-700">+${stats.totalProfit.toFixed(0)}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => setIsNewOrderModalOpen(true)}
                  className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Order</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(cust)}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition"
                    title="Delete customer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
