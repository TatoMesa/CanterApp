import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function BottomCartBar({ totalItems, totalPrice, onOpenCart }) {
  if (totalItems === 0) return null;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <button
          onClick={onOpenCart}
          className="w-full bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-dark hover:to-brand-primary text-white p-3.5 rounded-2xl shadow-glow-red flex items-center justify-between transition-all touch-active group"
        >
          {/* Item Count & Icon */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-brand-primary shadow-xs">
                {totalItems}
              </span>
            </div>
            <div className="text-left">
              <span className="text-[11px] font-semibold text-white/80 block uppercase tracking-wider">Tu Carrito</span>
              <span className="text-base font-extrabold text-white leading-none">
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>

          {/* Action Trigger */}
          <div className="flex items-center gap-1.5 font-extrabold text-xs bg-white text-brand-primary px-3.5 py-2 rounded-xl group-hover:translate-x-0.5 transition-transform shadow-xs">
            <span>Ver Pedido</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
}
