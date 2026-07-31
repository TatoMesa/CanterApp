import React from 'react';
import { Utensils, Beef, Pizza, Flame, CupSoda, IceCream, Tag } from 'lucide-react';

const ICON_MAP = {
  Utensils: Utensils,
  Beef: Beef,
  Pizza: Pizza,
  Flame: Flame,
  CupSoda: CupSoda,
  IceCream: IceCream,
  Tag: Tag
};

export default function CategorySelector({ categories, activeCategory, setActiveCategory }) {
  return (
    <div className="bg-white border-b border-slate-200/60 sticky top-[98px] z-20 shadow-xs">
      <div className="max-w-md mx-auto px-4 py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2">
        {categories.map((cat) => {
          const IconComponent = ICON_MAP[cat.icono] || Utensils;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all touch-active ${
                isActive
                  ? 'bg-brand-primary text-white shadow-glow-red scale-[1.02]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/50'
              }`}
            >
              <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{cat.nombre}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
