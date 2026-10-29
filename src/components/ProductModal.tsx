import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product, BottleSize, HeatLevel, CostBreakdown } from '../types';
import { X, Package, DollarSign, Flame, TrendingUp } from 'lucide-react';

export const ProductModal: React.FC = () => {
  const {
    isNewProductModalOpen,
    setIsNewProductModalOpen,
    editingProduct,
    setEditingProduct,
    addProduct,
    updateProduct,
  } = useApp();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [subtitle, setSubtitle] = useState('Scotch Bonnet Pepper Sauce');
  const [flavorProfile, setFlavorProfile] = useState('');
  const [description, setDescription] = useState('');
  const [heatLevel, setHeatLevel] = useState<HeatLevel>(4);
  const [bottleSize, setBottleSize] = useState<BottleSize>('125 ml (4.2 fl oz)');
  const [category, setCategory] = useState<Product['category']>('hot_sauce');

  const [peppersCost, setPeppersCost] = useState<number>(2.50);
  const [bottleCapCost, setBottleCapCost] = useState<number>(1.80);
  const [labelCost, setLabelCost] = useState<number>(0.90);
  const [vinegarSpicesCost, setVinegarSpicesCost] = useState<number>(1.60);
  const [laborCost, setLaborCost] = useState<number>(1.70);

  const [retailPrice, setRetailPrice] = useState<number>(25.00);
  const [wholesalePrice, setWholesalePrice] = useState<number>(16.00);
  const [inventoryCount, setInventoryCount] = useState<number>(24);
  const [minStockAlert, setMinStockAlert] = useState<number>(12);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setSku(editingProduct.sku);
      setSubtitle(editingProduct.subtitle || 'Scotch Bonnet Pepper Sauce');
      setFlavorProfile(editingProduct.flavorProfile || '');
      setDescription(editingProduct.description);
      setHeatLevel(editingProduct.heatLevel);
      setBottleSize(editingProduct.bottleSize);
      setCategory(editingProduct.category);

      setPeppersCost(editingProduct.costBreakdown.peppers);
      setBottleCapCost(editingProduct.costBreakdown.bottleAndCap);
      setLabelCost(editingProduct.costBreakdown.label);
      setVinegarSpicesCost(editingProduct.costBreakdown.vinegarAndSpices);
      setLaborCost(editingProduct.costBreakdown.laborAndOverhead);

      setRetailPrice(editingProduct.retailPrice);
      setWholesalePrice(editingProduct.wholesalePrice);
      setInventoryCount(editingProduct.inventoryCount);
      setMinStockAlert(editingProduct.minStockAlert);
    } else {
      setName('');
      setSku('RA-NEW-125');
      setSubtitle('Scotch Bonnet Pepper Sauce');
      setFlavorProfile('');
      setDescription('');
      setHeatLevel(4);
      setBottleSize('125 ml (4.2 fl oz)');
      setCategory('hot_sauce');

      setPeppersCost(2.50);
      setBottleCapCost(1.80);
      setLabelCost(0.90);
      setVinegarSpicesCost(1.60);
      setLaborCost(1.70);

      setRetailPrice(25.00);
      setWholesalePrice(16.00);
      setInventoryCount(24);
      setMinStockAlert(12);
    }
  }, [editingProduct, isNewProductModalOpen]);

  const productionCost = Number(
    (peppersCost + bottleCapCost + labelCost + vinegarSpicesCost + laborCost).toFixed(2)
  );

  const unitProfitRetail = retailPrice - productionCost;
  const retailMarginPct = retailPrice > 0 ? (unitProfitRetail / retailPrice) * 100 : 0;

  const unitProfitWholesale = wholesalePrice - productionCost;
  const wholesaleMarginPct = wholesalePrice > 0 ? (unitProfitWholesale / wholesalePrice) * 100 : 0;

  const handleClose = () => {
    setIsNewProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter a sauce name.');
      return;
    }

    const costBreakdown: CostBreakdown = {
      peppers: peppersCost,
      bottleAndCap: bottleCapCost,
      label: labelCost,
      vinegarAndSpices: vinegarSpicesCost,
      laborAndOverhead: laborCost,
    };

    const productPayload = {
      name,
      sku: sku || `RA-${name.slice(0, 3).toUpperCase()}-125`,
      subtitle,
      flavorProfile,
      description,
      heatLevel,
      bottleSize,
      costBreakdown,
      productionCost,
      retailPrice,
      wholesalePrice,
      inventoryCount,
      minStockAlert,
      status: 'active' as const,
      category,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    handleClose();
  };

  if (!isNewProductModalOpen && !editingProduct) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        <div className="bg-amber-950 text-white px-6 py-4 flex items-center justify-between border-b border-amber-900">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-600 rounded-lg text-white">
              <Package className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif-brand text-lg font-bold">
                {editingProduct ? `Edit Sauce: ${editingProduct.name}` : 'Add New Pepper Sauce Recipe'}
              </h3>
              <p className="text-xs text-amber-300">
                Configure production cost breakdown and price margins
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-amber-200 hover:text-white rounded-lg hover:bg-amber-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
          {/* Basics */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-stone-500 text-[11px]">
              1. Sauce Profile
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-medium mb-1">Sauce Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ginger Fire, Pineapple Blaze, Coconut Blaze"
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-bold text-stone-900"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">SKU / Code</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-mono-numbers"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Scotch Bonnet Pepper Sauce"
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Flavor Notes / Profile</label>
                <input
                  type="text"
                  value={flavorProfile}
                  onChange={(e) => setFlavorProfile(e.target.value)}
                  placeholder="e.g. BOLD • AROMATIC • FIERY"
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                >
                  <option value="hot_sauce">Hot Sauce</option>
                  <option value="fruit_fusion">Fruit Fusion</option>
                  <option value="limited_reserve">Limited Reserve / Special</option>
                  <option value="extra_hot">Extra Hot</option>
                  <option value="mild_seasoning">Mild Seasoning</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Bottle Size</label>
                <select
                  value={bottleSize}
                  onChange={(e) => setBottleSize(e.target.value as BottleSize)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-medium"
                >
                  <option value="125 ml (4.2 fl oz)">125 ml (4.2 fl oz) - Standard</option>
                  <option value="5 oz (148ml)">5 oz (148ml) Woozy</option>
                  <option value="10 oz (296ml)">10 oz (296ml)</option>
                  <option value="16 oz (473ml)">16 oz (Pint)</option>
                  <option value="1 Gallon (3.78L)">1 Gallon Jug</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Heat Level ({heatLevel}/5 🌶️)
                </label>
                <select
                  value={heatLevel}
                  onChange={(e) => setHeatLevel(Number(e.target.value) as HeatLevel)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-bold text-red-600"
                >
                  <option value={1}>1 - Mild</option>
                  <option value={2}>2 - Medium</option>
                  <option value={3}>3 - Hot</option>
                  <option value={4}>4 - Extra Hot</option>
                  <option value={5}>5 - Superhot / Extreme</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-stone-700 font-medium mb-1">Flavor Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Key pepper varieties, notes of garlic, shadow beni, citrus..."
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
          </div>

          {/* Unit Cost Breakdown */}
          <div className="space-y-3 pt-3 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h4 className="font-bold uppercase tracking-wider text-stone-500 text-[11px]">
                2. Unit Production Cost Breakdown (Per Bottle)
              </h4>
              <span className="font-mono-numbers text-stone-900 font-bold bg-stone-100 px-2 py-0.5 rounded">
                Total Cost: ${productionCost.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-600 mb-1">Fresh Peppers ($)</label>
                <input
                  type="number"
                  step="0.05"
                  value={peppersCost}
                  onChange={(e) => setPeppersCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Bottle, Cap & Dripper ($)</label>
                <input
                  type="number"
                  step="0.05"
                  value={bottleCapCost}
                  onChange={(e) => setBottleCapCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Vinyl Label & Seal ($)</label>
                <input
                  type="number"
                  step="0.02"
                  value={labelCost}
                  onChange={(e) => setLabelCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Vinegar, Garlic, Spices ($)</label>
                <input
                  type="number"
                  step="0.05"
                  value={vinegarSpicesCost}
                  onChange={(e) => setVinegarSpicesCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Labor & Energy/Gas ($)</label>
                <input
                  type="number"
                  step="0.05"
                  value={laborCost}
                  onChange={(e) => setLaborCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-mono-numbers"
                />
              </div>
            </div>
          </div>

          {/* Pricing, Margins & Inventory */}
          <div className="space-y-3 pt-3 border-t border-stone-200">
            <h4 className="font-bold uppercase tracking-wider text-stone-500 text-[11px]">
              3. Pricing, Margins & Storage Stock
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-stone-600 mb-1">Retail Price ($)</label>
                <input
                  type="number"
                  step="0.25"
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-bold font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Wholesale Price ($)</label>
                <input
                  type="number"
                  step="0.25"
                  value={wholesalePrice}
                  onChange={(e) => setWholesalePrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-bold font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">In Stock (Bottles)</label>
                <input
                  type="number"
                  min="0"
                  value={inventoryCount}
                  onChange={(e) => setInventoryCount(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-bold font-mono-numbers"
                />
              </div>

              <div>
                <label className="block text-stone-600 mb-1">Min Stock Alert</label>
                <input
                  type="number"
                  min="0"
                  value={minStockAlert}
                  onChange={(e) => setMinStockAlert(parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-mono-numbers"
                />
              </div>
            </div>

            {/* Profit preview pills */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-2 gap-3 font-mono-numbers">
              <div>
                <span className="text-[10px] text-stone-500 block uppercase font-bold">
                  Retail Profit Margin
                </span>
                <span className="text-sm font-extrabold text-emerald-700">
                  +${unitProfitRetail.toFixed(2)} ({retailMarginPct.toFixed(1)}%)
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-500 block uppercase font-bold">
                  Wholesale Profit Margin
                </span>
                <span className="text-sm font-extrabold text-amber-800">
                  +${unitProfitWholesale.toFixed(2)} ({wholesaleMarginPct.toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold rounded-xl shadow-md cursor-pointer transition transform active:scale-95"
            >
              {editingProduct ? 'Save Changes' : 'Add Sauce'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
