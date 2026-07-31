import React from 'react';
import { Plus, Minus } from 'lucide-react';

export default function ProductCard({ product, cartQuantity, onAddToCart, onRemoveFromCart }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex gap-3.5 relative overflow-hidden group">
      {/* Product Image */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
        <img
          src={product.imagen_final}
          alt={product.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {!product.disponible && (
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-1 text-center">
            <span className="text-[10px] font-extrabold text-white uppercase tracking-wider bg-rose-600 px-1.5 py-0.5 rounded">
              Pausado
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-brand-primary transition-colors">
            {product.nombre}
          </h3>
          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.descripcion}
          </p>
        </div>

        {/* Price & Add Action Button */}
        <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
          <span className="font-extrabold text-sm text-slate-900">
            {formatCurrency(product.precio)}
          </span>

          {/* Quick Add / Stepper Button */}
          {cartQuantity > 0 ? (
            <div className="flex items-center gap-2 bg-brand-light border border-brand-primary/20 rounded-full px-1.5 py-1">
              <button
                onClick={() => onRemoveFromCart(product)}
                className="w-6 h-6 rounded-full bg-white text-brand-primary flex items-center justify-center shadow-xs hover:bg-slate-50 active:scale-90 transition-all"
                aria-label="Restar un item"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <span className="font-extrabold text-xs text-brand-primary w-4 text-center">
                {cartQuantity}
              </span>
              <button
                onClick={() => onAddToCart(product)}
                className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-xs hover:bg-brand-dark active:scale-90 transition-all"
                aria-label="Sumar un item"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              disabled={!product.disponible}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-xs transition-all touch-active ${
                product.disponible
                  ? 'bg-brand-primary text-white hover:bg-brand-dark hover:shadow-glow-red'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              aria-label="Agregar al carrito"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
