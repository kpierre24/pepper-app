import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calculator,
  Flame,
  DollarSign,
  TrendingUp,
  Percent,
  Sparkles,
  Save,
  CheckCircle,
} from 'lucide-react';

export const PricingCalculator: React.FC = () => {
  const { addProduct, setActiveTab } = useApp();

  // Recipe Simulation Parameters
  const [recipeName, setRecipeName] = useState('Tropical Scotch Bonnet Fire');
  const [batchBottles, setBatchBottles] = useState<number>(48); // 4 cases of 12
  const [pepperLbs, setPepperLbs] = useState<number>(10); // lbs of fresh Scotch Bonnet peppers
  const [pepperCostPerLb, setPepperCostPerLb] = useState<number>(12.00); // $/lb
  const [bottleUnitCost, setBottleUnitCost] = useState<number>(1.80); // glass bottle, cap, dripper
  const [labelUnitCost, setLabelUnitCost] = useState<number>(0.90); // premium vinyl label
  const [vinegarSpicesBatchCost, setVinegarSpicesBatchCost] = useState<number>(75.00); // batch ginger, pineapple, coconut, vinegar & spices
  const [laborHours, setLaborHours] = useState<number>(4.0); // prep + cook + bottle
  const [laborHourlyRate, setLaborHourlyRate] = useState<number>(20.00); // $/hr

  // Target Selling Prices
  const [targetRetailPrice, setTargetRetailPrice] = useState<number>(25.00);
  const [targetWholesalePrice, setTargetWholesalePrice] = useState<number>(16.00);
  const [heatLevel, setHeatLevel] = useState<number>(4);

  // Derived calculations
  const totalPeppersCost = pepperLbs * pepperCostPerLb;
  const totalBottlesCost = batchBottles * bottleUnitCost;
  const totalLabelsCost = batchBottles * labelUnitCost;
  const totalVinegarSpicesCost = vinegarSpicesBatchCost;
  const totalLaborCost = laborHours * laborHourlyRate;

  const totalBatchCost =
    totalPeppersCost + totalBottlesCost + totalLabelsCost + totalVinegarSpicesCost + totalLaborCost;

  const unitProductionCost = batchBottles > 0 ? totalBatchCost / batchBottles : 0;

  // Breakdown per bottle
  const unitPepperCost = batchBottles > 0 ? totalPeppersCost / batchBottles : 0;
  const unitVinegarSpicesCost = batchBottles > 0 ? totalVinegarSpicesCost / batchBottles : 0;
  const unitLaborCost = batchBottles > 0 ? totalLaborCost / batchBottles : 0;

  // Retail metrics
  const unitProfitRetail = targetRetailPrice - unitProductionCost;
  const retailMarginPct = targetRetailPrice > 0 ? (unitProfitRetail / targetRetailPrice) * 100 : 0;
  const totalBatchRetailRevenue = batchBottles * targetRetailPrice;
  const totalBatchRetailProfit = totalBatchRetailRevenue - totalBatchCost;

  // Wholesale metrics
  const unitProfitWholesale = targetWholesalePrice - unitProductionCost;
  const wholesaleMarginPct =
    targetWholesalePrice > 0 ? (unitProfitWholesale / targetWholesalePrice) * 100 : 0;
  const totalBatchWholesaleRevenue = batchBottles * targetWholesalePrice;
  const totalBatchWholesaleProfit = totalBatchWholesaleRevenue - totalBatchCost;

  // Break even bottles
  const breakEvenBottles =
    targetRetailPrice > 0 ? Math.ceil(totalBatchCost / targetRetailPrice) : 0;

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveToCatalog = () => {
    addProduct({
      name: recipeName || 'New Artisan Batch',
      sku: `RA-${recipeName.slice(0, 3).toUpperCase()}-125`,
      subtitle: 'Scotch Bonnet Pepper Sauce',
      flavorProfile: 'BOLD • TROPICAL',
      description: `Artisanal craft batch yielding ${batchBottles} bottles with fresh peppers and spices.`,
      heatLevel: (heatLevel as any) || 3,
      bottleSize: '125 ml (4.2 fl oz)',
      costBreakdown: {
        peppers: Number(unitPepperCost.toFixed(2)),
        bottleAndCap: Number(bottleUnitCost.toFixed(2)),
        label: Number(labelUnitCost.toFixed(2)),
        vinegarAndSpices: Number(unitVinegarSpicesCost.toFixed(2)),
        laborAndOverhead: Number(unitLaborCost.toFixed(2)),
      },
      productionCost: Number(unitProductionCost.toFixed(2)),
      retailPrice: Number(targetRetailPrice.toFixed(2)),
      wholesalePrice: Number(targetWholesalePrice.toFixed(2)),
      inventoryCount: batchBottles,
      minStockAlert: 12,
      status: 'active',
      category: 'limited_reserve',
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setActiveTab('products');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-100 text-amber-900 rounded-lg">
              <Calculator className="w-5 h-5" />
            </span>
            <h2 className="font-serif-brand text-2xl font-bold text-stone-900">
              Batch Production Cost & Profit Margin Simulator
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Simulate a new pepper sauce recipe batch, fine-tune ingredient costs, calculate margins, and save directly to your product catalog.
          </p>
        </div>

        <button
          onClick={handleSaveToCatalog}
          disabled={savedSuccess}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition transform active:scale-95 disabled:bg-stone-400 self-start sm:self-auto"
        >
          {savedSuccess ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Saved to Catalog!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save as New Product</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Ingredient & Cost Inputs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Batch Basics */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif-brand text-base font-bold text-stone-900">
              1. Recipe & Batch Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Recipe / Sauce Name</label>
                <input
                  type="text"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Heat Level ({heatLevel}/5 🌶️)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={heatLevel}
                  onChange={(e) => setHeatLevel(Number(e.target.value))}
                  className="w-full accent-red-600 mt-2"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-stone-700">
                  Target Batch Yield: <span className="font-mono-numbers text-amber-800 font-extrabold">{batchBottles} bottles</span> ({(batchBottles / 12).toFixed(1)} cases of 12)
                </label>
              </div>
              <div className="flex gap-2">
                {[12, 24, 48, 96, 144].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setBatchBottles(size)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                      batchBottles === size
                        ? 'bg-amber-900 text-white border-amber-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {size} btls
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Raw Ingredient & Packaging Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <h3 className="font-serif-brand text-base font-bold text-stone-900">
              2. Batch Ingredients & Materials Cost
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Fresh Peppers */}
              <div className="p-3 bg-red-50/50 rounded-xl border border-red-200 space-y-2">
                <div className="flex justify-between font-bold text-red-950">
                  <span>Fresh Peppers</span>
                  <span className="font-mono-numbers">${totalPeppersCost.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-stone-500">Weight (lbs)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={pepperLbs}
                      onChange={(e) => setPepperLbs(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono-numbers"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500">Price / lb ($)</label>
                    <input
                      type="number"
                      step="0.25"
                      value={pepperCostPerLb}
                      onChange={(e) => setPepperCostPerLb(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono-numbers"
                    />
                  </div>
                </div>
              </div>

              {/* Glass Bottles & Caps */}
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
                <div className="flex justify-between font-bold text-amber-950">
                  <span>Glass Bottles & Caps</span>
                  <span className="font-mono-numbers">${totalBottlesCost.toFixed(2)}</span>
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500">Cost per bottle + dripper cap ($)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={bottleUnitCost}
                    onChange={(e) => setBottleUnitCost(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono-numbers mt-1"
                  />
                </div>
              </div>

              {/* Waterproof Vinyl Labels */}
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
                <div className="flex justify-between font-bold text-blue-950">
                  <span>Vinyl Labels & Shrink Bands</span>
                  <span className="font-mono-numbers">${totalLabelsCost.toFixed(2)}</span>
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500">Cost per printed label ($)</label>
                  <input
                    type="number"
                    step="0.02"
                    value={labelUnitCost}
                    onChange={(e) => setLabelUnitCost(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono-numbers mt-1"
                  />
                </div>
              </div>

              {/* Vinegar, Garlic, Shadow Beni & Spices */}
              <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                <div className="flex justify-between font-bold text-emerald-950">
                  <span>Vinegar, Garlic & Spices</span>
                  <span className="font-mono-numbers">${totalVinegarSpicesCost.toFixed(2)}</span>
                </div>
                <div>
                  <label className="block text-[10px] text-stone-500">Total batch spice & liquid cost ($)</label>
                  <input
                    type="number"
                    step="1"
                    value={vinegarSpicesBatchCost}
                    onChange={(e) => setVinegarSpicesBatchCost(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono-numbers mt-1"
                  />
                </div>
              </div>

              {/* Kitchen Labor & Cooking Energy */}
              <div className="sm:col-span-2 p-3 bg-purple-50/50 rounded-xl border border-purple-200 space-y-2">
                <div className="flex justify-between font-bold text-purple-950">
                  <span>Prep, Bottling Labor & Kitchen Utilities</span>
                  <span className="font-mono-numbers">${totalLaborCost.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-stone-500">Kitchen Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      value={laborHours}
                      onChange={(e) => setLaborHours(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono-numbers mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500">Labor / Energy Rate ($/hr)</label>
                    <input
                      type="number"
                      step="1"
                      value={laborHourlyRate}
                      onChange={(e) => setLaborHourlyRate(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-stone-300 rounded font-mono-numbers mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Financial & Margin Results */}
        <div className="space-y-6">
          <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 border border-stone-800 shadow-lg space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
                Batch Unit Economics
              </span>
              <h3 className="font-serif-brand text-xl font-bold text-white mt-1">
                ${unitProductionCost.toFixed(2)}
              </h3>
              <p className="text-xs text-stone-400">
                Total unit production cost per 125ml bottle
              </p>
            </div>

            <div className="border-t border-stone-800 pt-3 text-xs space-y-1.5 text-stone-300 font-mono-numbers">
              <div className="flex justify-between">
                <span>Total Batch Expense:</span>
                <span className="font-bold text-white">${totalBatchCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Peppers:</span>
                <span>${unitPepperCost.toFixed(2)} / btl</span>
              </div>
              <div className="flex justify-between">
                <span>Bottle & Cap:</span>
                <span>${bottleUnitCost.toFixed(2)} / btl</span>
              </div>
              <div className="flex justify-between">
                <span>Label:</span>
                <span>${labelUnitCost.toFixed(2)} / btl</span>
              </div>
              <div className="flex justify-between">
                <span>Spices & Vinegar:</span>
                <span>${unitVinegarSpicesCost.toFixed(2)} / btl</span>
              </div>
              <div className="flex justify-between">
                <span>Labor & Gas:</span>
                <span>${unitLaborCost.toFixed(2)} / btl</span>
              </div>
            </div>

            {/* Target Retail Price Slider */}
            <div className="border-t border-stone-800 pt-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-300">Target Retail Price</span>
                <span className="font-mono-numbers font-bold text-base text-white">
                  ${targetRetailPrice.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="0.50"
                value={targetRetailPrice}
                onChange={(e) => setTargetRetailPrice(Number(e.target.value))}
                className="w-full accent-amber-500"
              />

              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-400">Profit per bottle:</span>
                  <span className="font-bold text-emerald-400 font-mono-numbers">
                    +${unitProfitRetail.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Gross Margin:</span>
                  <span className="font-bold text-emerald-400 font-mono-numbers">
                    {retailMarginPct.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Full Batch Profit:</span>
                  <span className="font-bold text-emerald-400 font-mono-numbers">
                    +${totalBatchRetailProfit.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Target Wholesale Price Slider */}
            <div className="border-t border-stone-800 pt-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-stone-300">Target Wholesale Price</span>
                <span className="font-mono-numbers font-bold text-base text-white">
                  ${targetWholesalePrice.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="30"
                step="0.50"
                value={targetWholesalePrice}
                onChange={(e) => setTargetWholesalePrice(Number(e.target.value))}
                className="w-full accent-blue-500"
              />

              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-400">Wholesale Unit Profit:</span>
                  <span className="font-bold text-blue-400 font-mono-numbers">
                    +${unitProfitWholesale.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Wholesale Margin:</span>
                  <span className="font-bold text-blue-400 font-mono-numbers">
                    {wholesaleMarginPct.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Break-even Indicator */}
            <div className="border-t border-stone-800 pt-3 text-xs text-stone-400">
              Break-Even: You cover all batch expenses once you sell{' '}
              <strong className="text-amber-400 font-mono-numbers">{breakEvenBottles} bottles</strong>{' '}
              at retail!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
