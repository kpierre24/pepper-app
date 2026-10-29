import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import {
  Flame,
  LayoutDashboard,
  Layers,
  ShoppingBag,
  Package,
  Users,
  Calculator,
  Plus,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsNewOrderModalOpen,
    setIsNewProductModalOpen,
    setIsNewCustomerModalOpen,
    pendingCollation,
    totalStats,
    resetToDefaultData,
    exportDataJSON,
    importDataJSON,
  } = useApp();

  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const totalPendingBottles = pendingCollation.reduce((acc, item) => acc + item.totalBottlesOrdered, 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const ok = importDataJSON(content);
        if (ok) {
          alert('Data imported successfully!');
        } else {
          alert('Failed to parse import file. Please ensure it is a valid JSON export.');
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const navItems: { tab: ActiveTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      tab: 'overview',
      label: 'Overview & Profit',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      tab: 'collate',
      label: 'Collate Orders',
      icon: <Layers className="w-4 h-4" />,
      badge: totalPendingBottles > 0 ? `${totalPendingBottles} btls` : undefined,
    },
    {
      tab: 'orders',
      label: 'Orders',
      icon: <ShoppingBag className="w-4 h-4" />,
      badge: totalStats.pendingOrdersCount > 0 ? totalStats.pendingOrdersCount : undefined,
    },
    {
      tab: 'products',
      label: 'Sauce Catalog & Cost',
      icon: <Package className="w-4 h-4" />,
    },
    {
      tab: 'customers',
      label: 'Customers',
      icon: <Users className="w-4 h-4" />,
    },
    {
      tab: 'pricing_calc',
      label: 'Batch Cost Simulator',
      icon: <Calculator className="w-4 h-4" />,
    },
  ];

  return (
    <header className="bg-amber-950 text-stone-100 border-b border-amber-900/60 sticky top-0 z-30 shadow-md">
      {/* Top Banner with Brand Identity and Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 via-amber-600 to-amber-700 flex items-center justify-center shadow-inner shadow-amber-900 border border-amber-500/40 text-amber-100 flex-shrink-0">
            <Flame className="w-6 h-6 text-amber-200 fill-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif-brand text-2xl font-bold tracking-tight text-amber-50">
                Renee's Artisanal
              </h1>
              <span className="text-xs uppercase tracking-widest font-bold bg-red-950 text-amber-400 px-2 py-0.5 rounded border border-red-800/80">
                Pepper Sauce Co.
              </span>
            </div>
            <p className="text-xs text-amber-300/80 font-medium hidden sm:block">
              Order Collation, Production Batching & Profit Intelligence
            </p>
          </div>
        </div>

        {/* Quick Highlights: Fulfilled Profit & Pending Queue */}
        <div className="flex items-center gap-2.5 sm:gap-4 text-xs">
          <div className="hidden md:flex items-center gap-2 bg-amber-900/50 border border-amber-700/50 px-3 py-1.5 rounded-lg text-amber-200">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-amber-400 uppercase tracking-wider block font-semibold">
                Fulfilled Profit
              </span>
              <span className="font-bold text-sm text-emerald-300 font-mono-numbers">
                ${totalStats.totalProfitFulfilled.toFixed(2)}
              </span>
              <span className="text-[10px] text-emerald-400/90 ml-1">
                ({totalStats.profitMarginFulfilled.toFixed(1)}%)
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 bg-amber-900/50 border border-amber-700/50 px-3 py-1.5 rounded-lg text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-[10px] text-amber-400 uppercase tracking-wider block font-semibold">
                Pending Value
              </span>
              <span className="font-bold text-sm text-amber-200 font-mono-numbers">
                ${totalStats.pendingRevenue.toFixed(2)}
              </span>
              <span className="text-[10px] text-amber-300/70 ml-1">
                ({totalStats.pendingOrdersCount} orders)
              </span>
            </div>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-lg shadow-sm border border-red-400/30 transition-all transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </button>

          {/* Backup & Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="px-2.5 py-2 bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 rounded-lg border border-amber-700/50 text-xs font-medium cursor-pointer"
              title="Data tools"
            >
              Data ▾
            </button>
            {showSettingsMenu && (
              <div
                className="absolute right-0 mt-2 w-52 bg-stone-900 border border-amber-900/80 rounded-xl shadow-xl py-2 z-50 text-stone-200 text-xs"
                onMouseLeave={() => setShowSettingsMenu(false)}
              >
                <button
                  onClick={() => {
                    exportDataJSON();
                    setShowSettingsMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-amber-950/60 flex items-center gap-2 text-stone-200"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  Export Data (JSON)
                </button>
                <label className="w-full text-left px-4 py-2 hover:bg-amber-950/60 flex items-center gap-2 cursor-pointer text-stone-200">
                  <Upload className="w-3.5 h-3.5 text-blue-400" />
                  Import Data (JSON)
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <div className="border-t border-stone-800 my-1"></div>
                <button
                  onClick={() => {
                    resetToDefaultData();
                    setShowSettingsMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-950/40 text-red-400 flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                  Reset Demo Data
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-amber-950/90 border-t border-amber-900/50 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-2 py-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-amber-800 text-amber-100 shadow-sm border border-amber-600/40 font-semibold'
                    : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-900/40'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                      item.tab === 'collate'
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-amber-700/80 text-amber-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
