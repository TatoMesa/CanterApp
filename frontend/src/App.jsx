import React, { useState, useEffect } from 'react';
import Header from './components/client/Header';
import CategorySelector from './components/client/CategorySelector';
import ProductCard from './components/client/ProductCard';
import BottomCartBar from './components/client/BottomCartBar';
import CartModal from './components/client/CartModal';
import OrderTrackerModal from './components/client/OrderTrackerModal';
import KdsBoard from './components/kitchen/KdsBoard';
import ProductManagerModal from './components/kitchen/ProductManagerModal';
import KitchenAuthGate from './components/kitchen/KitchenAuthGate';

import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_ORDERS } from './services/mockData';

export default function App() {
  // Determine view based on URL path or hash
  const getInitialView = () => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path.includes('/cocina') || path.includes('/kds') || hash.includes('cocina')) {
      return 'kitchen';
    }
    return 'client';
  };

  const [activeView, setActiveView] = useState(getInitialView); // 'client' | 'kitchen'
  const [isKitchenAuthenticated, setIsKitchenAuthenticated] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Cargar pedidos almacenados o iniciar en blanco
  const getInitialOrders = () => {
    try {
      const saved = localStorage.getItem('canterapp_orders');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error leyendo localStorage orders', e);
    }
    return INITIAL_ORDERS;
  };

  const getInitialHistory = () => {
    try {
      const saved = localStorage.getItem('canterapp_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error leyendo localStorage history', e);
    }
    return [];
  };

  const [categories] = useState(INITIAL_CATEGORIES);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(getInitialOrders);
  const [allOrdersHistory, setAllOrdersHistory] = useState(getInitialHistory);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTrackedOrder, setActiveTrackedOrder] = useState(null);
  const [isProductManagerOpen, setIsProductManagerOpen] = useState(false);

  // Guardar cambios de pedidos en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('canterapp_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('Error guardando en localStorage', e);
    }
  }, [orders]);

  // Guardar historial completo de pedidos para estadísticas
  useEffect(() => {
    try {
      localStorage.setItem('canterapp_history', JSON.stringify(allOrdersHistory));
    } catch (e) {
      console.warn('Error guardando historial', e);
    }
  }, [allOrdersHistory]);

  // Sync URL changes
  useEffect(() => {
    const handlePopState = () => {
      setActiveView(getInitialView());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (view) => {
    setActiveView(view);
    if (view === 'kitchen') {
      window.history.pushState({}, '', '/cocina');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  // Cart helper actions
  const totalCartItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...product, cantidad: 1 }];
    });
  };

  const handleRemoveFromCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing && existing.cantidad > 1) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, cantidad: item.cantidad - 1 } : item
        );
      }
      return prev.filter((item) => item.id !== product.id);
    });
  };

  // Submit new order from Client Checkout
  const handleSubmitOrder = (newOrderData) => {
    const createdOrder = {
      id: Math.floor(1000 + Math.random() * 9000),
      ...newOrderData,
      // Los pedidos con Mercado Pago inician con estado de pago PENDIENTE
      estado_pago: 'PENDIENTE',
      estado_pedido: 'PENDIENTE',
      fecha_creacion: new Date().toISOString()
    };

    setOrders((prev) => [createdOrder, ...prev]);
    setAllOrdersHistory((prev) => [createdOrder, ...prev]);
    setCart([]);
    setActiveTrackedOrder(createdOrder);
  };

  // Kitchen KDS Order State Transition
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders
        .map((ord) => {
          if (ord.id === orderId) {
            const updated = { ...ord, estado_pedido: newStatus };
            if (activeTrackedOrder && activeTrackedOrder.id === orderId) {
              setActiveTrackedOrder(updated);
            }
            return updated;
          }
          return ord;
        })
        // Al marcar como ENTREGADO, quitar el pedido de las comandas activas de cocina
        .filter((ord) => ord.estado_pedido !== 'ENTREGADO')
    );
  };

  // Product Manager CRUD
  const handleSaveProduct = (savedProduct) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === savedProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === savedProduct.id ? savedProduct : p));
      }
      return [savedProduct, ...prev];
    });
  };

  const handleToggleAvailability = (productId) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, disponible: !p.disponible } : p))
    );
  };

  // Filtered products for client menu
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = activeCategory === 'all' || prod.categoria === activeCategory;
    const matchesSearch =
      prod.nombre.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      prod.descripcion.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {activeView === 'client' ? (
        /* ROL CLIENTE - VISTA MÓVIL ESTILO PEDIDOSYA (SIN LINK A COCINA) */
        <main className="flex-1 pb-28">
          {/* Top Navbar Header */}
          <Header
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            activeView={activeView}
            setActiveView={setActiveView}
            cartCount={totalCartItems}
          />

          {/* Horizontally scrollable top category chips */}
          <CategorySelector
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          {/* Tracking alert trigger */}
          <div className="max-w-md mx-auto px-4 mt-3">
            {activeTrackedOrder ? (
              <button
                onClick={() => setIsCartOpen(false) || setActiveTrackedOrder(activeTrackedOrder)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between shadow-xs transition-all ${
                  activeTrackedOrder.estado_pedido === 'LISTO_PARA_RETIRAR'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 animate-bounce-subtle shadow-glow-green'
                    : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">
                    {activeTrackedOrder.estado_pedido === 'LISTO_PARA_RETIRAR' ? '🔔' : '⏳'}
                  </span>
                  <div>
                    <span className="font-extrabold text-xs block">
                      Seguimiento Pedido #{activeTrackedOrder.id}
                    </span>
                    <span className="text-[11px] font-bold opacity-90">
                      Estado: {activeTrackedOrder.estado_pedido.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black bg-white/80 px-2.5 py-1 rounded-xl shadow-2xs">
                  Ver Estado ➔
                </span>
              </button>
            ) : (
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-3.5 shadow-md flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">
                    ¡Bienvenido a CanterApp!
                  </span>
                  <p className="text-xs font-bold mt-0.5">Elige tus platos favoritos y pide en segundos.</p>
                </div>
                <span className="text-2xl">🍔</span>
              </div>
            )}
          </div>

          {/* Product Grid / List */}
          <div className="max-w-md mx-auto px-4 mt-4 space-y-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <span className="text-4xl block mb-2">🔍</span>
                <p className="text-sm font-bold text-slate-700">No encontramos productos</p>
                <p className="text-xs text-slate-400 mt-1">Intenta con otra búsqueda o categoría</p>
              </div>
            ) : (
              filteredProducts.map((product) => {
                const cartItem = cart.find((i) => i.id === product.id);
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    cartQuantity={cartItem ? cartItem.cantidad : 0}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={handleRemoveFromCart}
                  />
                );
              })
            )}
          </div>

          {/* Fixed Floating Bottom Cart Bar */}
          <BottomCartBar
            totalItems={totalCartItems}
            totalPrice={totalCartPrice}
            onOpenCart={() => setIsCartOpen(true)}
          />

          {/* Footer discreto con acceso restringido para personal */}
          <footer className="max-w-md mx-auto px-4 mt-8 text-center border-t border-slate-200/60 pt-4">
            <p className="text-[11px] text-slate-400">© CanterApp Resto - Todos los derechos reservados</p>
            <button
              onClick={() => navigateTo('kitchen')}
              className="text-[10px] text-slate-300 hover:text-slate-500 transition-colors mt-1 underline"
            >
              Acceso Personal Autorizado
            </button>
          </footer>

          {/* Client Cart & Checkout Modal */}
          <CartModal
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            setCart={setCart}
            onSubmitOrder={handleSubmitOrder}
          />

          {/* Live Order Tracker Modal */}
          <OrderTrackerModal
            activeOrder={activeTrackedOrder}
            onClose={() => setActiveTrackedOrder(null)}
          />
        </main>
      ) : (
        /* ROL COCINA / ADMIN - VISTA CON ACCESO RESTRINGIDO (PIN 1234) */
        <main className="flex-1">
          {!isKitchenAuthenticated ? (
            <KitchenAuthGate onAuthenticated={() => setIsKitchenAuthenticated(true)} />
          ) : (
            <>
              {/* Header de salida de cocina */}
              <div className="bg-slate-950 px-4 py-2 text-right border-b border-slate-800 flex justify-between items-center text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  🔒 Sesión de Cocina Autenticada
                </span>
                <button
                  onClick={() => {
                    setIsKitchenAuthenticated(false);
                    navigateTo('client');
                  }}
                  className="text-slate-400 hover:text-white font-bold bg-slate-800 px-3 py-1 rounded-lg"
                >
                  Salir de Cocina
                </button>
              </div>

              <KdsBoard
                orders={orders}
                allOrdersHistory={allOrdersHistory}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onOpenProductManager={() => setIsProductManagerOpen(true)}
              />

              <ProductManagerModal
                isOpen={isProductManagerOpen}
                onClose={() => setIsProductManagerOpen(false)}
                products={products}
                categories={categories}
                onSaveProduct={handleSaveProduct}
                onToggleAvailability={handleToggleAvailability}
              />
            </>
          )}
        </main>
      )}
    </div>
  );
}
