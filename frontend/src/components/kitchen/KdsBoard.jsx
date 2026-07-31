import React, { useState } from 'react';
import { Clock, ChefHat, CheckCircle, AlertCircle, Banknote, CreditCard, ArrowRight, PlusCircle, BarChart3, LayoutGrid } from 'lucide-react';
import { soundAlert } from '../../services/soundAlert';
import OrderHistoryView from './OrderHistoryView';

export default function KdsBoard({ orders, allOrdersHistory = [], onUpdateOrderStatus, onOpenProductManager }) {
  const [kitchenTab, setKitchenTab] = useState('kanban'); // 'kanban' | 'history'

  const pendingOrders = orders.filter(o => o.estado_pedido === 'PENDIENTE');
  const prepOrders = orders.filter(o => o.estado_pedido === 'EN_PREPARACION');
  const readyOrders = orders.filter(o => o.estado_pedido === 'LISTO_PARA_RETIRAR');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getMinutesAgo = (isoDate) => {
    const diff = Math.floor((new Date() - new Date(isoDate)) / 60000);
    return diff < 1 ? 'Hace un instante' : `Hace ${diff} min`;
  };

  const handleAdvanceStatus = (orderId, nextStatus) => {
    onUpdateOrderStatus(orderId, nextStatus);
    if (nextStatus === 'LISTO_PARA_RETIRAR') {
      soundAlert.playReadyAlert();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6">
      {/* Top Header Bar for Kitchen */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                KDS Cocina <span className="text-xs bg-slate-800 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">Panel Restringido</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Gestión de comandas, menú y estadísticas en tiempo real</p>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Action Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
          {/* Tab Switcher: Kanban vs Historial & Estadísticas */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setKitchenTab('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                kitchenTab === 'kanban'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tablero Comandas</span>
            </button>
            <button
              onClick={() => setKitchenTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                kitchenTab === 'history'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Historial & Ventas</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('¿Deseas borrar la memoria caché de pedidos antiguos del navegador?')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="shrink-0 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors border border-slate-700"
            title="Borrar memoria caché de pedidos antiguos"
          >
            🧹 Resetear Caché
          </button>

          <button
            onClick={onOpenProductManager}
            className="shrink-0 px-3.5 py-2 bg-gradient-to-r from-brand-primary to-brand-accent hover:from-brand-dark hover:to-brand-primary text-white rounded-xl text-xs font-extrabold shadow-glow-red flex items-center justify-center gap-1.5 transition-all touch-active"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Gestionar Menú (CRUD)</span>
          </button>
        </div>
      </div>

      {/* View Switcher: Kanban Board vs Order History & Stats */}
      {kitchenTab === 'history' ? (
        <div className="max-w-7xl mx-auto mt-6">
          <OrderHistoryView allOrders={allOrdersHistory.length > 0 ? allOrdersHistory : orders} />
        </div>
      ) : (
        /* Kanban / Trello 3-Column Board */
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          
          {/* Column 1: PENDIENTES (Yellow) */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-amber-500/20 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
                <h2 className="font-extrabold text-amber-400 text-sm tracking-wide uppercase">
                  Pendientes
                </h2>
              </div>
              <span className="bg-amber-500/20 text-amber-300 text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-500/40">
                {pendingOrders.length}
              </span>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-[75vh] pr-1">
              {pendingOrders.length === 0 ? (
                <div className="text-center py-10 text-slate-600">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-semibold">Sin nuevos pedidos pendientes</p>
                </div>
              ) : (
                pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-slate-900 rounded-2xl p-4 border-l-4 border-amber-500 border-y border-r border-slate-800 shadow-md hover:border-amber-400/80 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-lg text-white">#{order.id}</span>
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" /> {getMinutesAgo(order.fecha_creacion)}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <p className="font-bold text-xs text-white">{order.cliente_nombre}</p>
                      <p className="text-[11px] text-amber-400 font-semibold">{order.mesa_o_direccion}</p>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-1.5 py-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-800/60 pb-1">
                          <span className="font-bold text-slate-200">
                            <span className="text-amber-400 font-black mr-1">{item.cantidad}x</span> {item.producto_nombre}
                          </span>
                        </div>
                      ))}
                      {order.notas_cocina && (
                        <div className="bg-amber-950/40 text-amber-200 border border-amber-500/30 text-[11px] p-2 rounded-lg font-medium mt-1">
                          ⚠️ Nota: {order.notas_cocina}
                        </div>
                      )}
                    </div>

                    {/* Payment Badge */}
                    <div className="flex items-center justify-between pt-1">
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        order.metodo_pago === 'MERCADO_PAGO'
                          ? order.estado_pago === 'PAGADO'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {order.metodo_pago === 'MERCADO_PAGO' ? (
                          order.estado_pago === 'PAGADO' ? (
                            <> <CreditCard className="w-3 h-3" /> ✅ MP (PAGADO) </>
                          ) : (
                            <> <CreditCard className="w-3 h-3" /> 🔴 MP (PAGO PENDIENTE) </>
                          )
                        ) : (
                          <> <Banknote className="w-3 h-3" /> Efectivo (${formatCurrency(order.total)}) </>
                        )}
                      </span>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleAdvanceStatus(order.id, 'EN_PREPARACION')}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors touch-active shadow-md"
                    >
                      <span>Comenzar Preparación</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 2: EN PREPARACIÓN (Blue) */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-blue-500/20 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                <h2 className="font-extrabold text-blue-400 text-sm tracking-wide uppercase">
                  En Preparación
                </h2>
              </div>
              <span className="bg-blue-500/20 text-blue-300 text-xs font-black px-2.5 py-0.5 rounded-full border border-blue-500/40">
                {prepOrders.length}
              </span>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-[75vh] pr-1">
              {prepOrders.length === 0 ? (
                <div className="text-center py-10 text-slate-600">
                  <ChefHat className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-semibold">Sin pedidos en preparación</p>
                </div>
              ) : (
                prepOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-slate-900 rounded-2xl p-4 border-l-4 border-blue-500 border-y border-r border-slate-800 shadow-md hover:border-blue-400/80 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-lg text-white">#{order.id}</span>
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-400 animate-spin" /> {getMinutesAgo(order.fecha_creacion)}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <p className="font-bold text-xs text-white">{order.cliente_nombre}</p>
                      <p className="text-[11px] text-blue-400 font-semibold">{order.mesa_o_direccion}</p>
                    </div>

                    {/* Order Items List */}
                    <div className="space-y-1.5 py-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-800/60 pb-1">
                          <span className="font-bold text-slate-100">
                            <span className="text-blue-400 font-black text-sm mr-1.5">{item.cantidad}x</span> {item.producto_nombre}
                          </span>
                        </div>
                      ))}
                      {order.notas_cocina && (
                        <div className="bg-blue-950/40 text-blue-200 border border-blue-500/30 text-[11px] p-2 rounded-lg font-medium mt-1">
                          ⚠️ Nota: {order.notas_cocina}
                        </div>
                      )}
                    </div>

                    {/* Action Button: AVISAR PEDIDO LISTO */}
                    <button
                      onClick={() => handleAdvanceStatus(order.id, 'LISTO_PARA_RETIRAR')}
                      className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all touch-active shadow-glow-green"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>🔔 Avisar Pedido Listo</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Column 3: LISTO PARA RETIRAR (Green) */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-emerald-500/20 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <h2 className="font-extrabold text-emerald-400 text-sm tracking-wide uppercase">
                  Listos para Retirar
                </h2>
              </div>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-black px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                {readyOrders.length}
              </span>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-[75vh] pr-1">
              {readyOrders.length === 0 ? (
                <div className="text-center py-10 text-slate-600">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-semibold">Sin pedidos listos esperando entrega</p>
                </div>
              ) : (
                readyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-slate-900 rounded-2xl p-4 border-l-4 border-emerald-500 border-y border-r border-slate-800 shadow-md space-y-3 animate-pulse-glow"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-lg text-emerald-400">#{order.id}</span>
                      <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                        ¡NOTIFICADO!
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <p className="font-bold text-xs text-white">{order.cliente_nombre}</p>
                      <p className="text-[11px] text-emerald-400 font-extrabold">{order.mesa_o_direccion}</p>
                    </div>

                    {/* Items summary */}
                    <div className="text-xs text-slate-300 font-medium">
                      {order.items.map(i => `${i.cantidad}x ${i.producto_nombre}`).join(', ')}
                    </div>

                    {/* Action Button: ENTREGADO */}
                    <button
                      onClick={() => handleAdvanceStatus(order.id, 'ENTREGADO')}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors touch-active border border-slate-700"
                    >
                      <span>✅ Marcar como Entregado</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
