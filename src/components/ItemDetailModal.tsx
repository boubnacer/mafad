import React, { useState } from 'react';
import { LostFoundItem } from '../types';
import { MapPin, Calendar, Tag, ShieldCheck, Phone, MessageSquare, Award, CheckCircle, Share2, X, ExternalLink } from 'lucide-react';

interface ItemDetailModalProps {
  item: LostFoundItem | null;
  onClose: () => void;
  onMarkReunited: (id: string) => void;
  onOpenMatch?: (item: LostFoundItem) => void;
  matchedItem?: LostFoundItem;
}

export default function ItemDetailModal({
  item,
  onClose,
  onMarkReunited,
  onOpenMatch,
  matchedItem
}: ItemDetailModalProps) {
  const [claimStep, setClaimStep] = useState<'details' | 'claimForm' | 'claimSuccess'>('details');
  const [claimProof, setClaimProof] = useState('');
  const [claimContact, setClaimContact] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  if (!item) return null;

  const isLost = item.type === 'LOST';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimProof.trim() || !claimContact.trim()) return;
    setClaimStep('claimSuccess');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span 
              className={`text-xs font-semibold px-2.5 py-1 rounded-md tracking-wide ${
                item.status === 'reunited'
                  ? 'bg-emerald-100 text-emerald-800'
                  : isLost 
                    ? 'bg-rose-100 text-rose-800' 
                    : 'bg-sky-100 text-sky-800'
              }`}
            >
              {item.status === 'reunited' ? 'REUNITED WITH OWNER' : isLost ? '● LOST ITEM' : '● FOUND ITEM'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ID: #{item.id.slice(-6)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleShare}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-md transition-colors text-xs flex items-center gap-1.5"
              title="Copy listing link"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedShare ? 'Copied!' : 'Share'}</span>
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Potential Match Alert Banner */}
          {matchedItem && (
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
                  <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                  Potential Match Found in Casablanca!
                </div>
                <p className="text-xs text-amber-800">
                  Matches with: <span className="font-medium text-amber-950">{matchedItem.title}</span> ({matchedItem.city})
                </p>
              </div>
              {onOpenMatch && (
                <button
                  onClick={() => onOpenMatch(matchedItem)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-xs"
                >
                  Compare Details
                </button>
              )}
            </div>
          )}

          {/* Main Title & Image */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 leading-snug">
              {item.title}
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-2">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {item.category}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {item.city}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {item.date}
              </span>
            </div>
          </div>

          {/* Image preview */}
          {item.image && (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-72">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-72 object-cover"
              />
              {item.reward && (
                <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  Reward: {item.reward}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Detailed Description &amp; Landmarks
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {item.description || 'No additional details provided.'}
            </p>
            {item.exactLocation && (
              <p className="text-xs text-slate-600 flex items-center gap-1.5 px-1">
                <span className="font-semibold text-slate-800">Exact Spot:</span> {item.exactLocation}
              </p>
            )}
          </div>

          {/* Verification / Security note */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 leading-relaxed">
              <span className="font-semibold text-slate-800 block mb-0.5">Community Protection Tip</span>
              Always verify identification features (e.g. phone lock screen wallpaper, specific scratches, keys count, or serial details) before meeting in a well-lit, public location like mall security or a police station.
            </div>
          </div>

          {/* Claim flow interactive section */}
          {claimStep === 'claimForm' && (
            <form onSubmit={handleSubmitClaim} className="p-4 bg-sky-50/80 border border-sky-200 rounded-xl space-y-3">
              <h4 className="text-sm font-bold text-sky-950 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                {isLost ? 'I Have Found This Item' : 'Claim Ownership of This Item'}
              </h4>
              <p className="text-xs text-sky-800">
                {isLost 
                  ? 'Tell the owner where you found it or where they can safely collect it from you.' 
                  : 'Describe unique secret details (wallpaper photo, passcode hint, unique scratches, or serial number) to verify ownership.'}
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Verification details or message *
                </label>
                <textarea
                  required
                  rows={3}
                  value={claimProof}
                  onChange={(e) => setClaimProof(e.target.value)}
                  placeholder={isLost ? "I picked this up at Starbucks. Handed to security desk #2..." : "The phone wallpaper is a picture of an orange cat, small dent on bottom left speaker..."}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Your Phone / WhatsApp / Email *
                </label>
                <input
                  type="text"
                  required
                  value={claimContact}
                  onChange={(e) => setClaimContact(e.target.value)}
                  placeholder="+212 6..."
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setClaimStep('details')}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200/50 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-xs"
                >
                  Send Verification Request
                </button>
              </div>
            </form>
          )}

          {claimStep === 'claimSuccess' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 space-y-1">
                <div className="font-semibold text-sm">Message &amp; Verification Sent!</div>
                <p>The poster has been notified. Check your phone ({claimContact}) for confirmation or coordination instructions.</p>
                <button
                  onClick={() => setClaimStep('details')}
                  className="text-xs font-semibold text-emerald-700 underline mt-1 block"
                >
                  Back to item overview
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
          <div>
            {item.status !== 'reunited' ? (
              <button
                onClick={() => onMarkReunited(item.id)}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1.5 hover:underline"
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Reunited / Resolved
              </button>
            ) : (
              <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
                ✓ Case Resolved
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {item.contactPhone && (
              <a
                href={`tel:${item.contactPhone}`}
                className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Call ({item.contactName || 'Reporter'})</span>
              </a>
            )}

            {claimStep === 'details' && item.status !== 'reunited' && (
              <button
                onClick={() => setClaimStep('claimForm')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                {isLost ? 'I Found This Item' : 'Claim Ownership'}
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
