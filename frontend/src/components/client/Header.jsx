import React from 'react';
import { Search, Utensils, ChefHat, Sparkles } from 'lucide-react';

export default function Header({ searchKeyword, setSearchKeyword, activeView, setActiveView, cartCount }) {
  return (
    <header className="sticky top-0 z-30 glass-header border-b border-slate-200/80 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-3">
        {/* Top bar with branding & Express badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center shadow-glow-red text-white">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h1 className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                  Canter<span className="text-brand-primary">App</span>
                </h1>
                <span className="bg-brand-light text-brand-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> Express
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Menú digital & pedidos móviles</p>
            </div>
          </div>
        </div>

        {/* Search Bar (Only shown in client view) */}
        {activeView === 'client' && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Buscar hamburguesas, pizzas, bebidas..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100/90 border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:bg-white transition-all"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold bg-slate-200 w-5 h-5 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
