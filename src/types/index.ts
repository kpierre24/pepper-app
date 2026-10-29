export type HeatLevel = 1 | 2 | 3 | 4 | 5;

export type BottleSize = '125 ml (4.2 fl oz)' | '5 oz (148ml)' | '10 oz (296ml)' | '16 oz (473ml)' | '1 Gallon (3.78L)';

export interface CostBreakdown {
  peppers: number;        // fresh Scotch Bonnet peppers
  bottleAndCap: number;   // glass bottle, cap, dripper orifice insert, seal
  label: number;          // premium vinyl label
  vinegarAndSpices: number; // ginger / pineapple / coconut, spices, vinegar, garlic
  laborAndOverhead: number; // artisan prep, bottling, sanitizing, energy
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  subtitle?: string;      // e.g. "Scotch Bonnet Pepper Sauce"
  flavorProfile?: string; // e.g. "Bold • Aromatic • Fiery"
  description: string;
  heatLevel: HeatLevel;
  bottleSize: BottleSize;
  costBreakdown: CostBreakdown;
  productionCost: number; // sum of costBreakdown
  retailPrice: number;    // retail selling price ($25)
  wholesalePrice: number; // wholesale price
  inventoryCount: number; // current bottles in stock
  minStockAlert: number;  // restock threshold
  status: 'active' | 'seasonal' | 'archived';
  category: 'hot_sauce' | 'extra_hot' | 'mild_seasoning' | 'fruit_fusion' | 'limited_reserve';
  image?: string;
  origin?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  type: 'retail' | 'wholesale' | 'subscriber' | 'market_stall';
  notes?: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  bottleSize: BottleSize;
  heatLevel: HeatLevel;
  quantity: number;
  unitPrice: number;
  unitProductionCost: number;
  subtotal: number;
  subtotalCost: number;
  subtotalProfit: number;
}

export type OrderStatus = 'pending' | 'in_production' | 'ready' | 'fulfilled' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'cod';
export type DeliveryMethod = 'pickup' | 'local_delivery' | 'shipping' | 'market_pickup';

export interface Order {
  id: string;
  orderNumber: string; // e.g. "RA-2026-081"
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  deliveryMethod: DeliveryMethod;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  totalProductionCost: number;
  totalGrossProfit: number;
  profitMarginPercent: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  fulfilledAt?: string;
  dueDate?: string;
}

export interface CollationSummaryItem {
  productId: string;
  productName: string;
  bottleSize: BottleSize;
  heatLevel: HeatLevel;
  totalBottlesOrdered: number;
  currentStock: number;
  stockDeficit: number; // how many need to be cooked / bottled
  ordersCount: number;
  orderNumbers: string[];
  totalExpectedRevenue: number;
  totalProductionCost: number;
  totalExpectedProfit: number;
}

export type ActiveTab = 'overview' | 'collate' | 'orders' | 'products' | 'customers' | 'pricing_calc';
