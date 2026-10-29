import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import {
  Package,
  Plus,
  Flame,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Edit2,
  Trash2,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import { ARTISANAL_TRIO_IMAGE } from '../data/seedData';
import { ConfirmationModal } from './ConfirmationModal';

export const ProductsList: React.FC = () => {
  const {
    products,
    setIsNewProductModalOpen,
    setEditingProduct,
    deleteProduct,
    adjustStock,
  } = useApp();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDelete = (prod: Product) => {
    setProductToDelete(prod);
  };

  // Helper for color branding based on sauce name
  const getSauceStyle = (name: string) => {
    if (name.toLowerCase().includes('ginger')) {
      return {
        badgeBg: 'bg-red-600 text-white',
        tagBg: 'bg-red-50 text-red-800 border-red-200',
        accentBorder: 'border-red-300',
        pill: 'bg-gradient-to-r from-red-600 to-amber-600 text-white',
      };
    }
    if (name.toLowerCase().includes('pineapple')) {
      return {
        badgeBg: 'bg-amber-500 text-amber-950',
        tagBg: 'bg-amber-50 text-amber-900 border-amber-200',
        accentBorder: 'border-amber-300',
        pill: 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-900',
      };
    }
    if (name.toLowerCase().includes('coconut')) {
      return {
        badgeBg: 'bg-teal-700 text-white',
        tagBg: 'bg-teal-50 text-teal-900 border-teal-200',
        accentBorder: 'border-teal-300',
        pill: 'bg-gradient-to-r from-teal-700 to-cyan-700 text-white',
      };
    }
    return {
      badgeBg: 'bg-stone-800 text-white',
      tagBg: 'bg-stone-100 text-stone-800 border-stone-200',
      accentBorder: 'border-stone-200',
      pill: 'bg-stone-800 text-white',
    };
  };

  return (
    <div className="space-y-6">
      {/* Featured Trio Banner */}
      <div className="bg-stone-900 rounded-3xl overflow-hidden border border-amber-900/60 shadow-xl relative">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          <div className="md:col-span-7 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-600/40">
                Trinidad & Tobago • Est. 2025
              </span>
              <span className="text-xs text-stone-400 font-medium">125 ml (4.2 fl oz)</span>
            </div>
            <div>
              <h2 className="font-serif-brand text-3xl sm:text-4xl font-bold text-amber-50">
                Renee's Artisanal Trio
              </h2>
              <p className="font-serif-brand italic text-lg text-amber-300/90 mt-1">
                Bold Flavours. Real Ingredients. Island Soul.
              </p>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
              Authentic handcrafted Scotch Bonnet pepper sauces featuring fresh Caribbean ginger root, sweet golden pineapple, and rich velvety coconut cream.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="bg-amber-400 text-stone-950 px-3.5 py-1.5 rounded-full font-extrabold font-mono-numbers text-sm flex items-center gap-1.5 shadow-md">
                <DollarSign className="w-4 h-4 -mr-1" />
                <span>$25.00 EACH</span>
                <span className="text-xs font-medium text-stone-800 font-sans">• 125 ml</span>
              </div>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsNewProductModalOpen(true);
                }}
                className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-600 text-xs font-semibold px-3.5 py-2 rounded-xl cursor-pointer transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Custom Sauce</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-5 relative h-56 sm:h-72 w-full overflow-hidden bg-stone-950 flex items-center justify-center">
            <img
              src={ARTISANAL_TRIO_IMAGE}
              alt="Renee's Artisanal Tropical Pepper Sauce Trio - Ginger Fire, Pineapple Blaze, Coconut Blaze"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-stone-900 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-red-100 text-red-700 rounded-lg">
              <Package className="w-5 h-5" />
            </span>
            <h2 className="font-serif-brand text-2xl font-bold text-stone-900">
              Active Pepper Sauce Catalog ({products.length} Items)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Current recipe costs, selling prices ($25 each), retail/wholesale profit margins, and inventory counts.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsNewProductModalOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md border border-red-400/40 cursor-pointer self-start sm:self-auto transition transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Sauce</span>
        </button>
      </div>

      {/* Sauce Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((prod) => {
          const unitProfitRetail = prod.retailPrice - prod.productionCost;
          const retailMargin = (unitProfitRetail / prod.retailPrice) * 100;
          const unitProfitWholesale = prod.wholesalePrice - prod.productionCost;
          const wholesaleMargin = (unitProfitWholesale / prod.wholesalePrice) * 100;
          const isLowStock = prod.inventoryCount <= prod.minStockAlert;
          const isExpanded = expandedId === prod.id;
          const style = getSauceStyle(prod.name);

          return (
            <div
              key={prod.id}
              className={`bg-white rounded-2xl border ${
                isLowStock ? 'border-amber-300 ring-2 ring-amber-200' : 'border-stone-200'
              } p-6 shadow-sm hover:shadow-lg transition flex flex-col justify-between relative overflow-hidden`}
            >
              {/* Top Accent Color Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${style.pill}`} />

              <div>
                {/* Header & Badges */}
                <div className="flex items-center justify-between mb-2 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-red-600">
                      {'🌶️'.repeat(prod.heatLevel)}
                    </span>
                    <span className="text-[10px] text-stone-400 font-semibold uppercase">
                      Heat {prod.heatLevel}/5
                    </span>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                    {prod.bottleSize}
                  </span>
                </div>

                {/* Title, Subtitle & Flavor Profile */}
                <h3 className="font-serif-brand text-2xl font-bold text-stone-900 leading-snug">
                  {prod.name}
                </h3>
                <div className="text-xs font-semibold text-amber-900 mt-0.5">
                  {prod.subtitle || 'Scotch Bonnet Pepper Sauce'}
                </div>

                {prod.flavorProfile && (
                  <div className={`mt-2 inline-block px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider ${style.tagBg} border`}>
                    {prod.flavorProfile}
                  </div>
                )}

                <p className="text-xs text-stone-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {prod.description}
                </p>

                {/* Stock Quick Controller */}
                <div className="mt-4 p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                      In-Stock Bottles
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xl font-extrabold text-stone-900 font-mono-numbers">
                        {prod.inventoryCount}
                      </span>
                      <span className="text-xs text-stone-500">bottles</span>
                      {isLowStock && (
                        <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full border border-red-300">
                          Low Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stock adjust buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => adjustStock(prod.id, -1)}
                      className="w-7 h-7 bg-white hover:bg-stone-200 border border-stone-300 rounded-lg font-bold text-stone-700 flex items-center justify-center text-sm cursor-pointer active:scale-95 transition"
                      title="Decrease by 1"
                    >
                      -
                    </button>
                    <button
                      onClick={() => adjustStock(prod.id, 1)}
                      className="w-7 h-7 bg-white hover:bg-stone-200 border border-stone-300 rounded-lg font-bold text-stone-700 flex items-center justify-center text-sm cursor-pointer active:scale-95 transition"
                      title="Increase by 1"
                    >
                      +
                    </button>
                    <button
                      onClick={() => adjustStock(prod.id, 12)}
                      className="px-2 h-7 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg font-bold text-amber-900 text-xs flex items-center justify-center cursor-pointer active:scale-95 transition"
                      title="Add 1 dozen batch"
                    >
                      +12
                    </button>
                  </div>
                </div>

                {/* Pricing & Profit Margin Cards */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">
                      Production Cost
                    </span>
                    <span className="text-base font-extrabold text-stone-800 font-mono-numbers">
                      ${prod.productionCost.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-stone-500 block">per bottle</span>
                  </div>

                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-800 uppercase font-bold block">
                      Retail Price (${prod.retailPrice.toFixed(2)})
                    </span>
                    <span className="text-base font-extrabold text-emerald-900 font-mono-numbers">
                      +${unitProfitRetail.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold block">
                      {retailMargin.toFixed(1)}% margin
                    </span>
                  </div>
                </div>

                {/* Expandable Cost Breakdown */}
                <div className="mt-3">
                  <button
                    onClick={() => toggleExpand(prod.id)}
                    className="w-full flex items-center justify-between text-[11px] font-semibold text-stone-500 hover:text-stone-800 py-1 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide' : 'View'} unit cost breakdown</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5 font-mono-numbers animate-fadeIn">
                      <div className="flex justify-between text-stone-600">
                        <span>Scotch Bonnet Peppers:</span>
                        <span>${prod.costBreakdown.peppers.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>Glass Bottle & Custom Cap:</span>
                        <span>${prod.costBreakdown.bottleAndCap.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>Artisanal Vinyl Label:</span>
                        <span>${prod.costBreakdown.label.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>Real Ingredients / Spices:</span>
                        <span>${prod.costBreakdown.vinegarAndSpices.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>Labor & Gas/Utilities:</span>
                        <span>${prod.costBreakdown.laborAndOverhead.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-stone-200 pt-1 flex justify-between font-bold text-stone-900">
                        <span>Wholesale Price:</span>
                        <span className="text-stone-800">
                          ${prod.wholesalePrice.toFixed(2)}{' '}
                          <span className="text-emerald-700 text-[11px] font-normal">
                            (+${unitProfitWholesale.toFixed(2)} / {wholesaleMargin.toFixed(0)}%)
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Card Footer Actions */}
              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-stone-400 font-mono-numbers">{prod.sku}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setIsNewProductModalOpen(true);
                    }}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(prod)}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition"
                    title="Delete product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Product Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!productToDelete}
        title={`Delete Sauce: ${productToDelete?.name || ''}`}
        message="Are you sure you want to remove this pepper sauce from your active catalog?"
        confirmText="Yes, Delete Sauce"
        cancelText="Cancel"
        isDestructive={true}
        itemDetails={
          productToDelete
            ? [
                { label: 'Sauce Name', value: productToDelete.name },
                { label: 'Bottle Size', value: productToDelete.bottleSize },
                { label: 'Current Inventory', value: `${productToDelete.inventoryCount} bottles` },
              ]
            : undefined
        }
        onConfirm={() => {
          if (productToDelete) {
            deleteProduct(productToDelete.id);
            setProductToDelete(null);
          }
        }}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
};
