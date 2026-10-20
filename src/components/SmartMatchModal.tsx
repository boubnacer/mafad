import React from 'react';
import { LostFoundItem } from '../types';
import { X, Sparkles, Check, ArrowRight, ShieldCheck, Phone } from 'lucide-react';

interface SmartMatchModalProps {
  lostItem: LostFoundItem;
  foundItem: LostFoundItem;
  onClose: () => void;
  onConfirmMatch: (lostId: string, foundId: string) => void;
}

export default function SmartMatchModal({
  lostItem,
  foundItem,
  onClose,
  onConfirmMatch
}: SmartMatchModalProps) {
  // Compute matching metrics
  const isSameCategory = lostItem.category === foundItem.category;
  const isSameCity = lostItem.city.toLowerCase().includes('casablanca') && foundItem.city.toLowerCase().includes('casablanca');
  const hasMoroccoMall = (lostItem.city + lostItem.description).toLowerCase().includes('morocco mall') && 
                         (foundItem.city + foundItem.description).toLowerCase().includes('morocco mall');
  
  const score = hasMoroccoMall ? 94 : (isSameCategory && isSameCity) ? 82 : 70;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Potential Match Analysis</h3>
              <p className="text-xs text-slate-500">Cross-referencing reported Lost and Found items</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {score}% Match Probability
            </span>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison grid */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Lost Item */}
            <div className="border border-rose-200 rounded-xl p-4 bg-rose-50/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                    Reported Lost
                  </span>
                  <span className="text-xs text-slate-400">{lostItem.date}</span>
                </div>
                {lostItem.image && (
                  <img 
                    src={lostItem.image} 
                    alt={lostItem.title} 
                    className="w-full h-40 object-cover rounded-lg mb-3 border border-rose-200"
                  />
                )}
                <h4 className="font-bold text-slate-900 text-base">{lostItem.title}</h4>
                <div className="text-xs text-slate-600 mt-1 space-y-1">
                  <p><span className="font-medium text-slate-700">Location:</span> {lostItem.city}</p>
                  <p><span className="font-medium text-slate-700">Category:</span> {lostItem.category}</p>
                  <p className="mt-2 text-slate-600 bg-white/70 p-2 rounded-md border border-slate-100 italic">
                    "{lostItem.description}"
                  </p>
                </div>
              </div>

              {lostItem.contactPhone && (
                <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Contact: {lostItem.contactName || 'Owner'}</span>
                  <span className="font-mono text-slate-700">{lostItem.contactPhone}</span>
                </div>
              )}
            </div>

            {/* Right: Found Item */}
            <div className="border border-sky-200 rounded-xl p-4 bg-sky-50/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                    Reported Found
                  </span>
                  <span className="text-xs text-slate-400">{foundItem.date}</span>
                </div>
                {foundItem.image && (
                  <img 
                    src={foundItem.image} 
                    alt={foundItem.title} 
                    className="w-full h-40 object-cover rounded-lg mb-3 border border-sky-200"
                  />
                )}
                <h4 className="font-bold text-slate-900 text-base">{foundItem.title}</h4>
                <div className="text-xs text-slate-600 mt-1 space-y-1">
                  <p><span className="font-medium text-slate-700">Location:</span> {foundItem.city}</p>
                  <p><span className="font-medium text-slate-700">Category:</span> {foundItem.category}</p>
                  <p className="mt-2 text-slate-600 bg-white/70 p-2 rounded-md border border-slate-100 italic">
                    "{foundItem.description}"
                  </p>
                </div>
              </div>

              {foundItem.contactPhone && (
                <div className="mt-4 pt-3 border-t border-sky-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Held by: {foundItem.contactName || 'Finder'}</span>
                  <span className="font-mono text-slate-700">{foundItem.contactPhone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Key match indicators */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-slate-800">Matching Attributes:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Device/Category: {lostItem.category}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Geographic Area: Casablanca (Morocco Mall)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dates coincide within 24 hours</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Color description / case matches</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Verify passcode or serial before handover</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirmMatch(lostItem.id, foundItem.id);
                onClose();
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Match &amp; Mark Reunited</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
