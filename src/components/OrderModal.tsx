import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { OrderItem, DeliveryMethod, OrderStatus, PaymentStatus, Order } from '../types';
import { X, Plus, Trash2, ShoppingBag, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';

export const OrderModal: React.FC = () => {
  const {
    products,
    customers,
    isNewOrderModalOpen,
    setIsNewOrderModalOpen,
    editingOrder,
    setEditingOrder,
    addOrder,
    updateOrder,
    deleteOrder,
  } = useApp();

  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('local_delivery');
  const [status, setStatus] = useState<OrderStatus>('pending');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [discount, setDiscount] = useState<number>(0);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);

  // Line items
  const [items, setItems] = useState<OrderItem[]>([]);

  // When opening modal for edit or new
  useEffect(() => {
    if (editingOrder) {
      setCustomerId(editingOrder.customerId);
      setCustomerName(editingOrder.customerName);
      setCustomerPhone(editingOrder.customerPhone);
      setCustomerEmail(editingOrder.customerEmail);
      setDeliveryAddress(editingOrder.deliveryAddress);
      setDeliveryMethod(editingOrder.deliveryMethod);
      setStatus(editingOrder.status);
      setPaymentStatus(editingOrder.paymentStatus);
      setDueDate(editingOrder.dueDate || '');
      setNotes(editingOrder.notes || '');
      setDiscount(editingOrder.discount);
      setDeliveryFee(editingOrder.deliveryFee);
      setItems(editingOrder.items);
    } else {
      // Default new order with 1 item if products exist
      if (customers.length > 0) {
        const firstCust = customers[0];
        setCustomerId(firstCust.id);
        setCustomerName(firstCust.name);
        setCustomerPhone(firstCust.phone);
        setCustomerEmail(firstCust.email);
        setDeliveryAddress(`${firstCust.address}, ${firstCust.city}`);
      } else {
        setCustomerId('');
        setCustomerName('');
        setCustomerPhone('');
        setCustomerEmail('');
        setDeliveryAddress('');
      }

      setDeliveryMethod('local_delivery');
      setStatus('pending');
      setPaymentStatus('pending');
      setDueDate('');
      setNotes('');
      setDiscount(0);
      setDeliveryFee(0);

      if (products.length > 0) {
        const p = products[0];
        setItems([
          {
            productId: p.id,
            productName: p.name,
            bottleSize: p.bottleSize,
            heatLevel: p.heatLevel,
            quantity: 3,
            unitPrice: p.retailPrice,
            unitProductionCost: p.productionCost,
            subtotal: p.retailPrice * 3,
            subtotalCost: p.productionCost * 3,
            subtotalProfit: (p.retailPrice - p.productionCost) * 3,
          },
        ]);
      } else {
        setItems([]);
      }
    }
  }, [editingOrder, isNewOrderModalOpen, customers, products]);

  // Handle customer select change
  const handleCustomerChange = (cId: string) => {
    setCustomerId(cId);
    const selected = customers.find((c) => c.id === cId);
    if (selected) {
      setCustomerName(selected.name);
      setCustomerPhone(selected.phone);
      setCustomerEmail(selected.email);
      setDeliveryAddress(`${selected.address}, ${selected.city}`);
      // Default delivery fee if wholesale or local
      if (selected.type === 'wholesale') {
        // Wholesale pricing for existing items if user wants
      }
    }
  };

  // Add item row
  const addItemRow = () => {
    if (products.length === 0) return;
    const p = products[0];
    const isWholesale = customers.find((c) => c.id === customerId)?.type === 'wholesale';
    const price = isWholesale ? p.wholesalePrice : p.retailPrice;

    setItems((prev) => [
      ...prev,
      {
        productId: p.id,
        productName: p.name,
        bottleSize: p.bottleSize,
        heatLevel: p.heatLevel,
        quantity: 1,
        unitPrice: price,
        unitProductionCost: p.productionCost,
        subtotal: price * 1,
        subtotalCost: p.productionCost * 1,
        subtotalProfit: (price - p.productionCost) * 1,
      },
    ]);
  };

  const removeItemRow = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, updates: Partial<OrderItem>) => {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;

        const updated = { ...item, ...updates };

        // If product changed, update name, size, heat, cost, price
        if (updates.productId) {
          const p = products.find((prod) => prod.id === updates.productId);
          if (p) {
            updated.productName = p.name;
            updated.bottleSize = p.bottleSize;
            updated.heatLevel = p.heatLevel;
            updated.unitProductionCost = p.productionCost;
            const isWholesale = customers.find((c) => c.id === customerId)?.type === 'wholesale';
            updated.unitPrice = isWholesale ? p.wholesalePrice : p.retailPrice;
          }
        }

        updated.subtotal = Number((updated.quantity * updated.unitPrice).toFixed(2));
        updated.subtotalCost = Number((updated.quantity * updated.unitProductionCost).toFixed(2));
        updated.subtotalProfit = Number((updated.subtotal - updated.subtotalCost).toFixed(2));
        return updated;
      })
    );
  };

  // Live Calculations
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const totalProductionCost = items.reduce((sum, item) => sum + item.subtotalCost, 0);
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const totalGrossProfit = total - totalProductionCost;
  const profitMarginPercent = total > 0 ? (totalGrossProfit / total) * 100 : 0;
  const totalBottles = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleClose = () => {
    setIsNewOrderModalOpen(false);
    setEditingOrder(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('Please enter or select a customer name.');
      return;
    }

    if (items.length === 0) {
      alert('Please add at least one pepper sauce item to the order.');
      return;
    }

    const orderData = {
      customerId: customerId || 'cust-walkin',
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress: deliveryAddress || 'Local Pickup / Hand Delivery',
      deliveryMethod,
      items,
      subtotal,
      discount,
      deliveryFee,
      tax: 0,
      total,
      totalProductionCost,
      totalGrossProfit,
      profitMarginPercent,
      status,
      paymentStatus,
      notes,
      dueDate: dueDate || undefined,
    };

    if (editingOrder) {
      updateOrder(editingOrder.id, orderData);
    } else {
      addOrder(orderData);
    }

    handleClose();
  };

  if (!isNewOrderModalOpen && !editingOrder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-amber-950 text-white px-6 py-4 flex items-center justify-between border-b border-amber-900">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-600 rounded-lg text-white">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif-brand text-lg font-bold">
                {editingOrder ? `Edit Order ${editingOrder.orderNumber}` : 'Create New Customer Order'}
              </h3>
              <p className="text-xs text-amber-300">
                Live cost calculation, profit margin preview & bottling collation
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Customer Selection & Contact */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                1. Customer & Delivery Info
              </h4>
              {customers.length > 0 && (
                <div className="text-xs text-stone-500">
                  Select existing:
                  <select
                    value={customerId}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    className="ml-2 bg-stone-100 border border-stone-300 rounded px-2 py-0.5 text-xs text-stone-800 font-medium"
                  >
                    <option value="">-- Choose Customer --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.type})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Island Grill or John Doe"
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-stone-700 font-medium mb-1">Delivery / Shipping Address</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Street address, Suite, City, State"
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Delivery Method</label>
                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value as DeliveryMethod)}
                  className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-medium"
                >
                  <option value="local_delivery">Local Doorstep Delivery</option>
                  <option value="pickup">Customer Pickup</option>
                  <option value="shipping">USPS / Courier Shipping</option>
                  <option value="market_pickup">Farmers Market Pickup</option>
                </select>
              </div>
            </div>
          </div>

          {/* Items & Bottles Picker */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                2. Pepper Sauce Items ({totalBottles} bottles)
              </h4>
              <button
                type="button"
                onClick={addItemRow}
                className="text-xs font-semibold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Sauce Item</span>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="p-4 text-center text-xs text-stone-500 bg-stone-50 rounded-xl border border-dashed border-stone-300">
                No items added yet. Click "+ Add Sauce Item" above.
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 grid grid-cols-12 gap-2.5 items-center text-xs"
                  >
                    {/* Sauce selection */}
                    <div className="col-span-12 sm:col-span-5">
                      <label className="block text-[10px] text-stone-500 mb-0.5">Sauce Flavor</label>
                      <select
                        value={item.productId}
                        onChange={(e) => updateItem(idx, { productId: e.target.value })}
                        className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-bold text-stone-900"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.bottleSize}) - ${p.retailPrice.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-4 sm:col-span-2">
                      <label className="block text-[10px] text-stone-500 mb-0.5">Qty (Bottles)</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                        className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-bold font-mono-numbers"
                      />
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-4 sm:col-span-2">
                      <label className="block text-[10px] text-stone-500 mb-0.5">Unit Price ($)</label>
                      <input
                        type="number"
                        step="0.25"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(idx, { unitPrice: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1.5 font-mono-numbers"
                      />
                    </div>

                    {/* Subtotal & Profit info */}
                    <div className="col-span-3 sm:col-span-2 text-right">
                      <label className="block text-[10px] text-stone-500 mb-0.5">Line Total</label>
                      <div className="font-bold text-stone-900 font-mono-numbers">${item.subtotal.toFixed(2)}</div>
                      <div className="text-[10px] text-emerald-700 font-mono-numbers">
                        +${item.subtotalProfit.toFixed(2)}
                      </div>
                    </div>

                    {/* Remove */}
                    <div className="col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => removeItemRow(idx)}
                        className="p-1 text-stone-400 hover:text-red-600 rounded cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing, Discount, Delivery & Live Profit Preview */}
          <div className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-stone-500 text-[11px]">
                3. Adjustments & Schedule
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Discount ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-mono-numbers"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Delivery Fee ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-mono-numbers"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-bold"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_production">In Production</option>
                    <option value="ready">Ready / Packed</option>
                    <option value="fulfilled">Fulfilled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Payment</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                  >
                    <option value="pending">Pending Payment</option>
                    <option value="paid">Paid in Full</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Due / Delivery Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Kitchen / Delivery Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Extra heat batch, gift wrap, leave on porch"
                  className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                />
              </div>
            </div>

            {/* Live Profit Preview Box */}
            <div className="bg-amber-950/5 border border-amber-900/20 rounded-2xl p-4 flex flex-col justify-between text-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-stone-700">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-amber-950">
                    Live Profit & Cost Preview
                  </span>
                  <span className="font-mono-numbers text-[11px] font-bold text-stone-500">
                    {totalBottles} bottles
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200/80 space-y-1.5 font-mono-numbers">
                  <div className="flex justify-between text-stone-600">
                    <span>Sauce Items Subtotal:</span>
                    <span className="font-bold text-stone-900">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Discount:</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  {deliveryFee > 0 && (
                    <div className="flex justify-between text-stone-600">
                      <span>Delivery / Shipping:</span>
                      <span>+${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-extrabold text-stone-900 border-t border-stone-200 pt-1.5">
                    <span>Order Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 space-y-1 font-mono-numbers">
                  <div className="flex justify-between text-stone-600 text-[11px]">
                    <span>Total Production Cost:</span>
                    <span>${totalProductionCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-900 font-extrabold text-sm">
                    <span>Net Gross Profit:</span>
                    <span>+${totalGrossProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold text-xs">
                    <span>Profit Margin:</span>
                    <span>{profitMarginPercent.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-stone-200">
                {editingOrder ? (
                  <button
                    type="button"
                    onClick={() => setIsDeleting(true)}
                    className="px-3.5 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Order</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
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
                    {editingOrder ? 'Update Order' : 'Save & Collate Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Delete Confirmation inside OrderModal */}
        {editingOrder && (
          <ConfirmationModal
            isOpen={isDeleting}
            title={`Delete Order ${editingOrder.orderNumber}`}
            message="Are you sure you want to permanently delete this order? All items, customer billing, and collation entries will be removed."
            confirmText="Yes, Delete Order"
            cancelText="Cancel"
            isDestructive={true}
            itemDetails={[
              { label: 'Customer', value: editingOrder.customerName },
              { label: 'Bottles', value: `${editingOrder.items.reduce((s, i) => s + i.quantity, 0)} bottles` },
              { label: 'Total', value: `$${editingOrder.total.toFixed(2)}` },
            ]}
            onConfirm={() => {
              deleteOrder(editingOrder.id);
              setIsDeleting(false);
              handleClose();
            }}
            onCancel={() => setIsDeleting(false)}
          />
        )}
      </div>
    </div>
  );
};
