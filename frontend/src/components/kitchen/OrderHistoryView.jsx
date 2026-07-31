import React, { useState } from 'react';
import { DollarSign, ShoppingBag, CreditCard, Banknote, TrendingUp, Calendar, Search, CheckCircle2, Award, FileText } from 'lucide-react';

export default function OrderHistoryView({ allOrders }) {
  const [searchFilter, setSearchFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return '';
    const date = new Date(isoStr);
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // KPI Calculations
  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = allOrders.length;
  const averageTicket = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  const mpTotal = allOrders
    .filter(o => o.metodo_pago === 'MERCADO_PAGO')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const cashTotal = allOrders
    .filter(o => o.metodo_pago === 'EFECTIVO')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // Top Selling Items Calculation
  const productStats = {};
  allOrders.forEach(order => {
    order.items?.forEach(item => {
      const name = item.producto_nombre || 'Producto';
      if (!productStats[name]) {
        productStats[name] = { name, quantity: 0, revenue: 0 };
      }
      productStats[name].quantity += item.cantidad;
      productStats[name].revenue += (item.precio_unitario * item.cantidad);
    });
  });

  const topProducts = Object.values(productStats)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Filtered Orders History
  const filteredOrders = allOrders.filter(order => {
    const matchesSearch =
      order.cliente_nombre?.toLowerCase().includes(searchFilter.toLowerCase()) ||
      order.id?.toString().includes(searchFilter) ||
      order.mesa_o_direccion?.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesPayment =
      paymentFilter === 'ALL' || order.metodo_pago === paymentFilter;

    return matchesSearch && matchesPayment;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">Ventas Totales</span>
            <span className="text-xl font-black text-emerald-400 mt-1 block">
              {formatCurrency(totalRevenue)}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Acumulado histórico</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">Pedidos Registrados</span>
            <span className="text-xl font-black text-white mt-1 block">
              {totalOrdersCount} <span className="text-xs font-normal text-slate-400">pedidos</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium">Ticket prom: {formatCurrency(averageTicket)}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Mercado Pago Sales */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">Cobrado por Mercado Pago</span>
            <span className="text-xl font-black text-sky-400 mt-1 block">
              {formatCurrency(mpTotal)}
            </span>
            <span className="text-[10px] text-sky-500/80 font-medium">Digital / Tarjeta</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        {/* Cash Sales */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">Cobrado en Efectivo</span>
            <span className="text-xl font-black text-amber-400 mt-1 block">
              {formatCurrency(cashTotal)}
            </span>
            <span className="text-[10px] text-amber-500/80 font-medium">Caja en mostrador</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <Banknote className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Top Products Ranking & Search Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Selling Dishes Ranking */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">Ranking de Platos Más Vendidos</h3>
          </div>

          <div className="space-y-3">
            {topProducts.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">Sin estadísticas de platos aún</p>
            ) : (
              topProducts.map((prod, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-6 h-6 rounded-full text-xs font-extrabold flex items-center justify-center ${
                      index === 0 ? 'bg-amber-400 text-slate-950' : index === 1 ? 'bg-slate-300 text-slate-950' : 'bg-amber-700 text-white'
                    }`}>
                      #{index + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-white truncate">{prod.name}</h4>
                      <p className="text-[10px] text-slate-400">{prod.quantity} unidades vendidas</p>
                    </div>
                  </div>
                  <span className="font-black text-xs text-emerald-400">
                    {formatCurrency(prod.revenue)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detailed Order History Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4">
          
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <h3 className="font-extrabold text-sm text-white">Historial Completo de Pedidos</h3>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Buscar cliente, mesa..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Payment Filter */}
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl text-xs text-white px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">Todos los pagos</option>
                <option value="EFECTIVO">Efectivo</option>
                <option value="MERCADO_PAGO">Mercado Pago</option>
              </select>
            </div>
          </div>

          {/* Table list */}
          <div className="overflow-x-auto">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                No hay pedidos registrados en el historial
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-2">Pedido</th>
                    <th className="py-2.5 px-2">Cliente / Ubicación</th>
                    <th className="py-2.5 px-2">Fecha y Hora</th>
                    <th className="py-2.5 px-2">Método de Pago</th>
                    <th className="py-2.5 px-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-950/60 transition-colors">
                      <td className="py-3 px-2 font-black text-white">#{order.id}</td>
                      <td className="py-3 px-2">
                        <span className="font-bold text-slate-200 block">{order.cliente_nombre}</span>
                        <span className="text-[10px] text-slate-400">{order.mesa_o_direccion}</span>
                      </td>
                      <td className="py-3 px-2 text-slate-400 font-medium">
                        {formatDate(order.fecha_creacion)}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          order.metodo_pago === 'MERCADO_PAGO'
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        }`}>
                          {order.metodo_pago === 'MERCADO_PAGO' ? 'Mercado Pago' : 'Efectivo'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-black text-emerald-400">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
