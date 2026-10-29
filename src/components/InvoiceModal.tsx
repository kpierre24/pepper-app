import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Printer, Flame, CheckCircle2, MapPin, Phone, Mail } from 'lucide-react';

export const InvoiceModal: React.FC = () => {
  const { viewingInvoiceOrder, setViewingInvoiceOrder } = useApp();

  if (!viewingInvoiceOrder) return null;

  const order = viewingInvoiceOrder;
  const totalBottles = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Top Modal Bar (hidden on print) */}
        <div className="no-print bg-stone-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-semibold">
              Invoice & Packing Slip — {order.orderNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-lg text-xs font-bold cursor-pointer transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={() => setViewingInvoiceOrder(null)}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice & Slip Content */}
        <div id="printable-invoice" className="p-8 space-y-6 text-stone-800 bg-white">
          {/* Header Brand */}
          <div className="flex justify-between items-start border-b-2 border-amber-950/20 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-9 h-9 rounded-lg bg-red-700 flex items-center justify-center text-white font-bold text-lg">
                  🌶️
                </div>
                <div>
                  <h1 className="font-serif-brand text-2xl font-bold tracking-tight text-stone-950">
                    Renee's Artisanal
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-900 block">
                    Small Batch Pepper Sauce Co.
                  </span>
                </div>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Handcrafted in South Florida • Authentic Caribbean Recipes
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase tracking-widest font-bold text-stone-400 block">
                Order & Packing Slip
              </span>
              <span className="font-mono-numbers text-xl font-bold text-stone-900 block mt-0.5">
                {order.orderNumber}
              </span>
              <span className="text-xs text-stone-500 block">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </span>
              {order.dueDate && (
                <span className="text-xs font-semibold text-red-700 block mt-0.5">
                  Target Due: {order.dueDate}
                </span>
              )}
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-2 gap-6 text-xs border-b border-stone-100 pb-5">
            <div>
              <span className="font-bold text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                Customer Recipient
              </span>
              <div className="font-bold text-sm text-stone-900">{order.customerName}</div>
              <div className="text-stone-600 mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-stone-400" />
                <span>{order.customerPhone || 'N/A'}</span>
              </div>
              {order.customerEmail && (
                <div className="text-stone-600 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-stone-400" />
                  <span>{order.customerEmail}</span>
                </div>
              )}
            </div>

            <div>
              <span className="font-bold text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                Delivery Details
              </span>
              <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                <span>{order.deliveryAddress}</span>
              </div>
              <div className="text-stone-600 mt-1 capitalize font-medium">
                Method: <strong className="text-stone-800">{order.deliveryMethod.replace('_', ' ')}</strong>
              </div>
              <div className="text-stone-600">
                Payment Status:{' '}
                <span className="font-bold uppercase text-[10px] bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded">
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Notes if present */}
          {order.notes && (
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-stone-700">
              <strong className="text-amber-950 font-bold block mb-0.5">Kitchen & Packing Note:</strong>
              {order.notes}
            </div>
          )}

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-300 text-stone-500 uppercase tracking-wider text-[11px]">
                  <th className="py-2 text-center w-8">✓</th>
                  <th className="py-2">Item / Pepper Sauce Flavor</th>
                  <th className="py-2">Size & Heat</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="py-2.5">
                    <td className="py-2 text-center">
                      <div className="w-4 h-4 border border-stone-400 rounded mx-auto" />
                    </td>
                    <td className="py-2 font-bold text-stone-900">
                      {item.productName}
                    </td>
                    <td className="py-2 text-stone-600">
                      {item.bottleSize}{' '}
                      <span className="text-red-600 font-bold ml-1">
                        {'🌶️'.repeat(item.heatLevel)}
                      </span>
                    </td>
                    <td className="py-2 text-center font-bold font-mono-numbers">
                      {item.quantity}
                    </td>
                    <td className="py-2 text-right font-mono-numbers">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-2 text-right font-mono-numbers font-bold text-stone-900">
                      ${item.subtotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="border-t border-stone-200 pt-4 flex justify-between items-start text-xs font-mono-numbers">
            <div className="text-stone-500 space-y-1">
              <div>Total Bottles: <strong className="text-stone-900">{totalBottles} bottles</strong></div>
              <div>Status: <strong className="capitalize text-stone-900">{order.status.replace('_', ' ')}</strong></div>
            </div>

            <div className="w-56 space-y-1.5 text-right">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
              )}
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Delivery / Shipping:</span>
                  <span>+${order.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-base text-stone-950 border-t border-stone-300 pt-1.5">
                <span>Total Due:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Packing Sign-off Footer */}
          <div className="pt-6 border-t border-dashed border-stone-200 flex justify-between items-end text-[11px] text-stone-400">
            <div>
              <div>Packed By: ______________________</div>
              <div className="mt-1">Batch QA & Seal Verified: [ &nbsp; ] Yes</div>
            </div>
            <div className="text-right">
              <p className="italic text-stone-500">Thank you for supporting Renee's Artisanal!</p>
              <p className="text-[10px] text-stone-400 mt-0.5">Keep refrigerated after opening.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
