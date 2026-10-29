import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Customer } from '../types';
import { X, Users } from 'lucide-react';

export const CustomerModal: React.FC = () => {
  const {
    isNewCustomerModalOpen,
    setIsNewCustomerModalOpen,
    addCustomer,
  } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState<Customer['type']>('retail');
  const [notes, setNotes] = useState('');

  const handleClose = () => {
    setIsNewCustomerModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCity('');
    setType('retail');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a customer or business name.');
      return;
    }

    addCustomer({
      name,
      email,
      phone,
      address,
      city,
      type,
      notes,
    });

    handleClose();
  };

  if (!isNewCustomerModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-stone-200 overflow-hidden">
        <div className="bg-amber-950 text-white px-6 py-4 flex items-center justify-between border-b border-amber-900">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-600 rounded-lg text-white">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif-brand text-lg font-bold">Add New Customer</h3>
              <p className="text-xs text-amber-300">Register retail buyer or wholesale client</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-amber-200 hover:text-white rounded-lg hover:bg-amber-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-stone-700 font-bold mb-1">Customer / Business Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Island Grill or Sarah Jenkins"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg font-medium text-stone-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-medium mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 000-0000"
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@domain.com"
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-stone-700 font-medium mb-1">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="442 Ocean Drive"
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-stone-700 font-medium mb-1">City / State</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Miami, FL"
                className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">Customer Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg font-medium"
            >
              <option value="retail">Retail Buyer</option>
              <option value="wholesale">Wholesale / Restaurant Account</option>
              <option value="subscriber">Monthly Sauce Club Subscriber</option>
              <option value="market_stall">Farmers Market Regular</option>
            </select>
          </div>

          <div>
            <label className="block text-stone-700 font-medium mb-1">Customer Preferences & Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Loves superhot reserves, deliveries to kitchen back door before lunch rush"
              className="w-full px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-lg"
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-stone-900 hover:bg-black text-amber-100 font-bold rounded-xl shadow-md cursor-pointer transition transform active:scale-95"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
