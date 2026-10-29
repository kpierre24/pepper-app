import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { OrderCollationView } from './components/OrderCollationView';
import { OrdersList } from './components/OrdersList';
import { ProductsList } from './components/ProductsList';
import { CustomersList } from './components/CustomersList';
import { PricingCalculator } from './components/PricingCalculator';
import { OrderModal } from './components/OrderModal';
import { ProductModal } from './components/ProductModal';
import { CustomerModal } from './components/CustomerModal';
import { InvoiceModal } from './components/InvoiceModal';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {activeTab === 'overview' && <DashboardOverview />}
      {activeTab === 'collate' && <OrderCollationView />}
      {activeTab === 'orders' && <OrdersList />}
      {activeTab === 'products' && <ProductsList />}
      {activeTab === 'customers' && <CustomersList />}
      {activeTab === 'pricing_calc' && <PricingCalculator />}

      {/* Global Modals */}
      <OrderModal />
      <ProductModal />
      <CustomerModal />
      <InvoiceModal />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#fcfbf9] text-[#1f2421] flex flex-col font-sans">
        <Header />
        <div className="flex-1">
          <MainContent />
        </div>
        <footer className="no-print bg-stone-900 text-stone-400 border-t border-stone-800 py-6 text-xs text-center">
          <div className="max-w-7xl mx-auto px-4 space-y-1">
            <p className="font-serif-brand text-amber-200 text-sm font-semibold">
              Renee's Artisanal — Small Batch Caribbean Pepper Sauce Co.
            </p>
            <p className="text-stone-400">
              Order Collation Engine • Recipe Cost & Profit Intelligence • Batch Bottling Manager
            </p>
            <p className="text-[10px] text-stone-300 pt-1">
              Data saved locally in browser storage • Export / Backup available anytime
            </p>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}
