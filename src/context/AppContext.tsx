import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Product, Customer, Order, OrderStatus, CollationSummaryItem, ActiveTab } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS, INITIAL_ORDERS } from '../data/seedData';
import confetti from 'canvas-confetti';

interface AppContextType {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Product CRUD
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;

  // Customer CRUD
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Order CRUD
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  batchUpdateOrderStatus: (orderIds: string[], status: OrderStatus) => void;
  fulfillOrder: (id: string) => void;

  // Collation & Analytics
  pendingCollation: CollationSummaryItem[];
  totalStats: {
    totalRevenueFulfilled: number;
    totalCostFulfilled: number;
    totalProfitFulfilled: number;
    profitMarginFulfilled: number;
    pendingOrdersCount: number;
    pendingRevenue: number;
    pendingCost: number;
    pendingExpectedProfit: number;
    pendingBottlesCount: number;
    totalOrdersCount: number;
    inventoryTotalValue: number;
    inventoryTotalBottles: number;
  };

  // UI Modals helper
  isNewOrderModalOpen: boolean;
  setIsNewOrderModalOpen: (open: boolean) => void;
  isNewProductModalOpen: boolean;
  setIsNewProductModalOpen: (open: boolean) => void;
  isNewCustomerModalOpen: boolean;
  setIsNewCustomerModalOpen: (open: boolean) => void;
  viewingInvoiceOrder: Order | null;
  setViewingInvoiceOrder: (order: Order | null) => void;
  editingProduct: Product | null;
  setEditingProduct: (prod: Product | null) => void;
  editingOrder: Order | null;
  setEditingOrder: (ord: Order | null) => void;

  // Backup & Restore
  resetToDefaultData: () => void;
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'reneas_artisanal_products_v2',
  CUSTOMERS: 'reneas_artisanal_customers_v2',
  ORDERS: 'reneas_artisanal_orders_v2',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch (e) {
      console.error('Error loading products from localStorage', e);
      return INITIAL_PRODUCTS;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch (e) {
      console.error('Error loading customers from localStorage', e);
      return INITIAL_CUSTOMERS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch (e) {
      console.error('Error loading orders from localStorage', e);
      return INITIAL_ORDERS;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Modal states
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [viewingInvoiceOrder, setViewingInvoiceOrder] = useState<Order | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
    } catch (e) {
      console.error('Error saving customers', e);
    }
  }, [customers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders', e);
    }
  }, [orders]);

  // Product Actions
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newId = `prod-${Date.now()}`;
    const newProduct: Product = { ...productData, id: newId };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, ...updates };
          // If cost breakdown changed, recalculate productionCost
          if (updates.costBreakdown) {
            const cb = updates.costBreakdown;
            updated.productionCost = Number(
              (cb.peppers + cb.bottleAndCap + cb.label + cb.vinegarAndSpices + cb.laborAndOverhead).toFixed(2)
            );
          }
          return updated;
        }
        return item;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const adjustStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newCount = Math.max(0, p.inventoryCount + delta);
          return { ...p, inventoryCount: newCount };
        }
        return p;
      })
    );
  };

  // Customer Actions
  const addCustomer = (customerData: Omit<Customer, 'id' | 'createdAt'>): Customer => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  // Order Actions
  const addOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const orderNum = `RA-${1040 + orders.length + 1}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === id ? { ...ord, ...updates } : ord))
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((ord) => ord.id !== id));
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === id) {
          const updates: Partial<Order> = { status };
          if (status === 'fulfilled' && !ord.fulfilledAt) {
            updates.fulfilledAt = new Date().toISOString();
          }
          return { ...ord, ...updates };
        }
        return ord;
      })
    );
  };

  const batchUpdateOrderStatus = (orderIds: string[], status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (orderIds.includes(ord.id)) {
          const updates: Partial<Order> = { status };
          if (status === 'fulfilled' && !ord.fulfilledAt) {
            updates.fulfilledAt = new Date().toISOString();
          }
          return { ...ord, ...updates };
        }
        return ord;
      })
    );
  };

  const fulfillOrder = (id: string) => {
    updateOrderStatus(id, 'fulfilled');
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#dc2626', '#f59e0b', '#16a34a', '#d97706'],
      });
    } catch {
      // ignore
    }
  };

  // Collation Summary of all active (pending/in_production/ready) orders
  const pendingCollation = useMemo(() => {
    const activeOrders = orders.filter(
      (o) => o.status === 'pending' || o.status === 'in_production' || o.status === 'ready'
    );

    const collationMap = new Map<string, CollationSummaryItem>();

    activeOrders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.productId || item.productName;
        const existing = collationMap.get(key);

        const currentProduct = products.find((p) => p.id === item.productId || p.name === item.productName);
        const currentStock = currentProduct?.inventoryCount ?? 0;

        if (existing) {
          existing.totalBottlesOrdered += item.quantity;
          if (!existing.orderNumbers.includes(order.orderNumber)) {
            existing.orderNumbers.push(order.orderNumber);
            existing.ordersCount += 1;
          }
          existing.totalExpectedRevenue += item.subtotal;
          existing.totalProductionCost += item.subtotalCost;
          existing.totalExpectedProfit += item.subtotalProfit;
          existing.stockDeficit = Math.max(0, existing.totalBottlesOrdered - currentStock);
        } else {
          const deficit = Math.max(0, item.quantity - currentStock);
          collationMap.set(key, {
            productId: item.productId,
            productName: item.productName,
            bottleSize: item.bottleSize,
            heatLevel: item.heatLevel,
            totalBottlesOrdered: item.quantity,
            currentStock,
            stockDeficit: deficit,
            ordersCount: 1,
            orderNumbers: [order.orderNumber],
            totalExpectedRevenue: item.subtotal,
            totalProductionCost: item.subtotalCost,
            totalExpectedProfit: item.subtotalProfit,
          });
        }
      });
    });

    return Array.from(collationMap.values()).sort(
      (a, b) => b.totalBottlesOrdered - a.totalBottlesOrdered
    );
  }, [orders, products]);

  // Overall Financial & Analytics calculation
  const totalStats = useMemo(() => {
    const fulfilledOrders = orders.filter((o) => o.status === 'fulfilled');
    const pendingOrders = orders.filter(
      (o) => o.status === 'pending' || o.status === 'in_production' || o.status === 'ready'
    );

    const totalRevenueFulfilled = fulfilledOrders.reduce((sum, o) => sum + o.total, 0);
    const totalCostFulfilled = fulfilledOrders.reduce((sum, o) => sum + o.totalProductionCost, 0);
    const totalProfitFulfilled = fulfilledOrders.reduce((sum, o) => sum + o.totalGrossProfit, 0);
    const profitMarginFulfilled =
      totalRevenueFulfilled > 0 ? (totalProfitFulfilled / totalRevenueFulfilled) * 100 : 0;

    const pendingRevenue = pendingOrders.reduce((sum, o) => sum + o.total, 0);
    const pendingCost = pendingOrders.reduce((sum, o) => sum + o.totalProductionCost, 0);
    const pendingExpectedProfit = pendingOrders.reduce((sum, o) => sum + o.totalGrossProfit, 0);
    const pendingBottlesCount = pendingOrders.reduce(
      (sum, o) => sum + o.items.reduce((iSum, i) => iSum + i.quantity, 0),
      0
    );

    const inventoryTotalBottles = products.reduce((sum, p) => sum + p.inventoryCount, 0);
    const inventoryTotalValue = products.reduce(
      (sum, p) => sum + p.inventoryCount * p.retailPrice,
      0
    );

    return {
      totalRevenueFulfilled,
      totalCostFulfilled,
      totalProfitFulfilled,
      profitMarginFulfilled,
      pendingOrdersCount: pendingOrders.length,
      pendingRevenue,
      pendingCost,
      pendingExpectedProfit,
      pendingBottlesCount,
      totalOrdersCount: orders.length,
      inventoryTotalValue,
      inventoryTotalBottles,
    };
  }, [orders, products]);

  const resetToDefaultData = () => {
    if (window.confirm("Reset catalog and orders to Renee's Artisanal Tropical Trio (Ginger Fire, Pineapple Blaze, Coconut Blaze)?")) {
      setProducts(INITIAL_PRODUCTS);
      setCustomers(INITIAL_CUSTOMERS);
      setOrders(INITIAL_ORDERS);
      localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
      localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
      localStorage.removeItem(STORAGE_KEYS.ORDERS);
      localStorage.removeItem('reneas_artisanal_products_v1');
      localStorage.removeItem('reneas_artisanal_customers_v1');
      localStorage.removeItem('reneas_artisanal_orders_v1');
    }
  };

  const exportDataJSON = () => {
    const data = {
      brand: "Renee's Artisanal",
      exportDate: new Date().toISOString(),
      products,
      customers,
      orders,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `renees-artisanal-orders-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.products && Array.isArray(parsed.products)) {
        setProducts(parsed.products);
      }
      if (parsed.customers && Array.isArray(parsed.customers)) {
        setCustomers(parsed.customers);
      }
      if (parsed.orders && Array.isArray(parsed.orders)) {
        setOrders(parsed.orders);
      }
      return true;
    } catch (err) {
      console.error('Import failed', err);
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        customers,
        orders,
        activeTab,
        setActiveTab,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addOrder,
        updateOrder,
        deleteOrder,
        updateOrderStatus,
        batchUpdateOrderStatus,
        fulfillOrder,
        pendingCollation,
        totalStats,
        isNewOrderModalOpen,
        setIsNewOrderModalOpen,
        isNewProductModalOpen,
        setIsNewProductModalOpen,
        isNewCustomerModalOpen,
        setIsNewCustomerModalOpen,
        viewingInvoiceOrder,
        setViewingInvoiceOrder,
        editingProduct,
        setEditingProduct,
        editingOrder,
        setEditingOrder,
        resetToDefaultData,
        exportDataJSON,
        importDataJSON,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
