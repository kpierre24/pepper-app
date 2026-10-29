import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemDetails?: {
    label: string;
    value: string | number;
  }[];
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  itemDetails,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 flex items-start gap-3.5 border-b border-stone-100">
          <div className={`p-2.5 rounded-xl flex-shrink-0 ${isDestructive ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-serif-brand text-lg font-bold text-stone-900 leading-snug">
              {title}
            </h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item Details Summary (if provided) */}
        {itemDetails && itemDetails.length > 0 && (
          <div className="p-4 bg-stone-50 border-b border-stone-100 space-y-1.5 text-xs font-mono-numbers">
            {itemDetails.map((detail, idx) => (
              <div key={idx} className="flex justify-between text-stone-600">
                <span className="font-medium text-stone-500 font-sans">{detail.label}:</span>
                <span className="font-bold text-stone-900">{detail.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-4 bg-stone-50/50 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-xl text-xs font-semibold cursor-pointer transition shadow-xs"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            className={`px-4 py-2 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-md ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                : 'bg-stone-900 hover:bg-black'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
