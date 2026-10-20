import React from 'react';
import { LostFoundItem } from '../types';
import { MapPin, Calendar, Award, Sparkles, ChevronRight } from 'lucide-react';

interface ItemCardProps {
  item: LostFoundItem;
  onSelect: (item: LostFoundItem) => void;
  hasMatch?: boolean;
}

export default function ItemCard({ item, onSelect, hasMatch }: ItemCardProps) {
  const isLost = item.type === 'LOST';
  const isReunited = item.status === 'reunited';

  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Thumbnail Image Container */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 border-b border-slate-100">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50 text-xs font-medium">
              No photo attached
            </div>
          )}

          {/* Status badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-md tracking-wider uppercase shadow-xs ${
                isReunited
                  ? 'bg-emerald-600 text-white'
                  : isLost
                  ? 'bg-rose-600 text-white'
                  : 'bg-sky-600 text-white'
              }`}
            >
              {isReunited ? 'Reunited' : isLost ? 'Lost Item' : 'Found Item'}
            </span>

            {hasMatch && !isReunited && (
              <span className="bg-amber-500 text-white text-[11px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-xs animate-pulse">
                <Sparkles className="w-3 h-3" />
                Match!
              </span>
            )}
          </div>

          {/* Reward badge */}
          {item.reward && (
            <div className="absolute bottom-3 right-3 bg-amber-500 text-white px-2.5 py-0.5 rounded-md text-xs font-bold flex items-center gap-1 shadow-sm">
              <Award className="w-3.5 h-3.5" />
              {item.reward}
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-4 sm:p-5 space-y-2">
          {/* Unboxed clean metadata line */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="text-slate-700">{item.category}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{item.date}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {item.title}
          </h3>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Card Footer with location and CTA */}
      <div className="px-4 sm:px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 truncate mr-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{item.city}</span>
        </div>

        <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 shrink-0">
          Details
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
