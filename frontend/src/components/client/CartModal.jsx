import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, CreditCard, Banknote, User, Phone, MapPin, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';

export default function CartModal({ isOpen, onClose, cart, setCart, onSubmitOrder }) {
  if (!isOpen) return null;

  const [clienteNombre, setClienteNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [mesaODireccion, setMesaODireccion] = useState('Mesa 1');
  const [notasCocina, setNotasCocina] = useState('');
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleQuantityChange = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === productId) {
          const newQty = item.cantidad + delta;
          return newQty > 0 ? { ...item, cantidad: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const handleRemoveItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!clienteNombre || !telefono || !mesaODireccion) {
      alert('Por favor completa tu Nombre, Teléfono y Mesa/Dirección.');
      return;
    }

    setIsSubmitting(true);

    const newOrder = {
      cliente_nombre: clienteNombre,
      telefono: telefono,
      mesa_o_direccion: mesaODireccion,
      notas_cocina: notasCocina,
      metodo_pago: metodoPago,
      items: cart.map(item => ({
        id: item.id,
        producto_id: item.id,
        producto_nombre: item.nombre,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        notas: item.notas || ''
      })),
      total: totalPrice
    };

    setTimeout(() => {
      onSubmitOrder(newOrder);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">Tu Pedido</h2>
            <p className="text-xs text-slate-500 font-medium">Revisa tus ítems y completa tus datos</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <span className="text-4xl block mb-2">🛒</span>
              <p className="text-sm font-bold text-slate-700">Tu carrito está vacío</p>
              <p className="text-xs text-slate-400 mt-1">Agrega deliciosos platos para comenzar</p>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Detalle de Platos</h3>
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img src={item.imagen_final} alt={item.nombre} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{item.nombre}</h4>
                      <p className="text-[11px] font-extrabold text-brand-primary">
                        {formatCurrency(item.precio * item.cantidad)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shadow-2xs hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="font-extrabold text-xs text-slate-800 w-4 text-center">{item.cantidad}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold shadow-2xs hover:bg-slate-100"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="w-6 h-6 rounded-lg text-slate-400 hover:text-rose-600 ml-1 flex items-center justify-center"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Form Details */}
          {cart.length > 0 && (
            <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Datos para la Entrega</h3>

              {/* Name Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-brand-primary" /> Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={clienteNombre}
                  onChange={(e) => setClienteNombre(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:bg-white"
                />
              </div>

              {/* Phone & Table Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-brand-primary" /> Teléfono / WA *
                  </label>
                  <input
                    type="tel"
                    required
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="Ej: 11 4455 6677"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-primary" /> Mesa / Ubicación *
                  </label>
                  <input
                    type="text"
                    required
                    value={mesaODireccion}
                    onChange={(e) => setMesaODireccion(e.target.value)}
                    placeholder="Ej: Mesa 5 o Barra"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:bg-white"
                  />
                </div>
              </div>

              {/* Kitchen Notes */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> Aclaraciones para la cocina (opcional)
                </label>
                <input
                  type="text"
                  value={notasCocina}
                  onChange={(e) => setNotasCocina(e.target.value)}
                  placeholder="Ej: Sin mayonesa, la hamburguesa cocida..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:bg-white"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  Método de Pago
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Cash Choice */}
                  <button
                    type="button"
                    onClick={() => setMetodoPago('EFECTIVO')}
                    className={`p-3 rounded-2xl border-2 text-left flex flex-col justify-between transition-all touch-active ${
                      metodoPago === 'EFECTIVO'
                        ? 'border-brand-primary bg-brand-light/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Banknote className={`w-5 h-5 ${metodoPago === 'EFECTIVO' ? 'text-brand-primary' : 'text-slate-400'}`} />
                      <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                        metodoPago === 'EFECTIVO' ? 'border-brand-primary bg-brand-primary' : 'border-slate-300'
                      }`}>
                        {metodoPago === 'EFECTIVO' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                      </span>
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block">Efectivo</span>
                      <span className="text-[10px] text-slate-500 font-medium leading-tight block">Cobro en mostrador</span>
                    </div>
                  </button>

                  {/* Mercado Pago Choice */}
                  <button
                    type="button"
                    onClick={() => setMetodoPago('MERCADO_PAGO')}
                    className={`p-3 rounded-2xl border-2 text-left flex flex-col justify-between transition-all touch-active ${
                      metodoPago === 'MERCADO_PAGO'
                        ? 'border-blue-500 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <CreditCard className={`w-5 h-5 ${metodoPago === 'MERCADO_PAGO' ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                        metodoPago === 'MERCADO_PAGO' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                      }`}>
                        {metodoPago === 'MERCADO_PAGO' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                      </span>
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block">Mercado Pago</span>
                      <span className="text-[10px] text-blue-600 font-bold leading-tight block">Tarjeta / App MP</span>
                    </div>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer / Submit Button */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-600">Total a Pagar</span>
              <span className="text-lg font-extrabold text-slate-900">{formatCurrency(totalPrice)}</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm text-white shadow-glow-red flex items-center justify-center gap-2 transition-all touch-active ${
                metodoPago === 'MERCADO_PAGO'
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600'
                  : 'bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-dark hover:to-brand-primary'
              }`}
            >
              {isSubmitting ? (
                <span>Enviando pedido...</span>
              ) : (
                <>
                  <span>
                    {metodoPago === 'MERCADO_PAGO' ? 'Pagar con Mercado Pago' : 'Confirmar Pedido'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-400 font-medium mt-2 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" /> Pedido seguro enviado directamente a la cocina
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
