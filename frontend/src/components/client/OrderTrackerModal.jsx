import React, { useEffect, useRef } from 'react';
import { CheckCircle2, Clock, UtensilsCrossed, Bell, Volume2, Sparkles, MapPin, X } from 'lucide-react';
import { soundAlert } from '../../services/soundAlert';

export default function OrderTrackerModal({ activeOrder, onClose }) {
  if (!activeOrder) return null;

  const previousStatusRef = useRef(activeOrder.estado_pedido);

  // Detect status change to trigger sound & vibration
  useEffect(() => {
    if (
      activeOrder.estado_pedido === 'LISTO_PARA_RETIRAR' &&
      previousStatusRef.current !== 'LISTO_PARA_RETIRAR'
    ) {
      soundAlert.playReadyAlert();
    }
    previousStatusRef.current = activeOrder.estado_pedido;
  }, [activeOrder.estado_pedido]);

  const isReady = activeOrder.estado_pedido === 'LISTO_PARA_RETIRAR';
  const isPrep = activeOrder.estado_pedido === 'EN_PREPARACION';
  const isDelivered = activeOrder.estado_pedido === 'ENTREGADO';

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header with Close */}
        <div className={`p-5 text-white transition-colors duration-500 flex items-center justify-between ${
          isReady
            ? 'bg-gradient-to-r from-emerald-500 to-green-600 animate-pulse-glow'
            : isPrep
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
            : 'bg-gradient-to-r from-amber-500 to-orange-500'
        }`}>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-md">
              Seguimiento en Vivo
            </span>
            <h2 className="text-xl font-extrabold mt-1">Pedido #{activeOrder.id}</h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Tracker Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Highlight Banner when Ready */}
          {isReady ? (
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-4 text-center animate-bounce-subtle shadow-glow-green">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center mb-2 shadow-md">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="font-extrabold text-emerald-900 text-base flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 text-emerald-600" /> ¡TU PEDIDO ESTÁ LISTO!
              </h3>
              <p className="text-xs font-semibold text-emerald-700 mt-1">
                Por favor retíralo en el mostrador indicando el número <span className="font-extrabold text-emerald-900">#{activeOrder.id}</span>
              </p>
              <button
                onClick={() => soundAlert.playReadyAlert()}
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-200/70 hover:bg-emerald-200 px-3 py-1.5 rounded-full transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" /> Probar Alerta de Sonido
              </button>
            </div>
          ) : isPrep ? (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 text-white mx-auto flex items-center justify-center mb-2">
                <UtensilsCrossed className="w-5 h-5 animate-spin" />
              </div>
              <h3 className="font-bold text-blue-900 text-sm">En Marcha en la Cocina</h3>
              <p className="text-xs text-blue-700 mt-0.5">Nuestros chefs están preparando tu pedido con los mejores ingredientes.</p>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-white mx-auto flex items-center justify-center mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-amber-900 text-sm">Pedido Recibido</h3>
              <p className="text-xs text-amber-700 mt-0.5">El pedido ingresó correctamente a la comanda de la cocina.</p>
            </div>
          )}

          {/* Vertical Stepper Status Timeline */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {/* Step 1: Recibido */}
            <div className="relative flex items-start gap-3">
              <span className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                true ? 'bg-emerald-500 text-white ring-4 ring-white' : 'bg-slate-300 text-slate-600'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
              <div>
                <h4 className="font-bold text-xs text-slate-900">1. Pedido Confirmado</h4>
                <p className="text-[11px] text-slate-500">Recibido por el sistema</p>
              </div>
            </div>

            {/* Step 2: En Preparación */}
            <div className="relative flex items-start gap-3">
              <span className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                isPrep || isReady || isDelivered ? 'bg-emerald-500 text-white ring-4 ring-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {isPrep || isReady || isDelivered ? <CheckCircle2 className="w-3.5 h-3.5" /> : '2'}
              </span>
              <div>
                <h4 className={`font-bold text-xs ${isPrep ? 'text-blue-600' : 'text-slate-900'}`}>
                  2. En Preparación
                </h4>
                <p className="text-[11px] text-slate-500">Cocinando los ítems</p>
              </div>
            </div>

            {/* Step 3: Listo para retirar */}
            <div className="relative flex items-start gap-3">
              <span className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                isReady || isDelivered ? 'bg-emerald-500 text-white ring-4 ring-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {isReady || isDelivered ? <CheckCircle2 className="w-3.5 h-3.5" /> : '3'}
              </span>
              <div>
                <h4 className={`font-bold text-xs ${isReady ? 'text-emerald-600 font-extrabold' : 'text-slate-900'}`}>
                  3. ¡Listo para Retirar!
                </h4>
                <p className="text-[11px] text-slate-500">Avisado al cliente</p>
              </div>
            </div>
          </div>

          {/* Order Details Breakdown */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
              <span className="font-bold text-slate-700">Cliente: {activeOrder.cliente_nombre}</span>
              <span className="flex items-center gap-1 font-semibold text-slate-600">
                <MapPin className="w-3 h-3 text-brand-primary" /> {activeOrder.mesa_o_direccion}
              </span>
            </div>

            <div className="space-y-1 py-1">
              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">
                    {item.cantidad}x {item.producto_nombre}
                  </span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(item.precio_unitario * item.cantidad)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 font-extrabold text-xs">
              <span className="text-slate-600">Método de Pago:</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeOrder.metodo_pago === 'MERCADO_PAGO'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {activeOrder.metodo_pago === 'MERCADO_PAGO' ? 'Mercado Pago (Pagado)' : 'Efectivo en Mostrador'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Cerrar Seguimiento
          </button>
        </div>
      </div>
    </div>
  );
}
