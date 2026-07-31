export const INITIAL_CATEGORIES = [
  { id: 'all', nombre: 'Todas', icono: 'Utensils' },
  { id: 'burgers', nombre: 'Hamburguesas', icono: 'Beef' },
  { id: 'pizzas', nombre: 'Pizzas & Mozza', icono: 'Pizza' },
  { id: 'empanadas', nombre: 'Empanadas', icono: 'Flame' },
  { id: 'drinks', nombre: 'Bebidas', icono: 'CupSoda' },
  { id: 'desserts', nombre: 'Postres', icono: 'IceCream' },
];

export const INITIAL_PRODUCTS = [
  {
    id: 101,
    categoria: 'burgers',
    nombre: 'Smash Double Cheese Burger',
    descripcion: 'Doble medalla de carne smash 120g, doble cheddar cheddar inglés, bacon crocante y salsa Canter secreta en pan brioche.',
    precio: 8900.00,
    imagen_final: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    disponible: true
  },
  {
    id: 102,
    categoria: 'burgers',
    nombre: 'Tasty Bacon BBQ Crispy',
    descripcion: 'Medalla vacuna 180g, queso muzzarella fundido, aros de cebolla empanados, bacon ahumado y salsa barbacoa agridulce.',
    precio: 9500.00,
    imagen_final: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    disponible: true
  },
  {
    id: 103,
    categoria: 'pizzas',
    nombre: 'Pizza Napolitana Premium',
    descripcion: 'Salsa de tomate italiano San Marzano, doble mozzarella de búfala, rodajas de tomate fresco, ajo y albahaca fresca.',
    precio: 11200.00,
    imagen_final: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    disponible: true
  },
  {
    id: 104,
    categoria: 'pizzas',
    nombre: 'Fugazzeta Rellena de Queso',
    descripcion: 'Masa de fermentación lenta rellena de queso cremoso y mozzarella, cubierta con abundante cebolla confitada y orégano.',
    precio: 12500.00,
    imagen_final: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    disponible: true
  },
  {
    id: 105,
    categoria: 'empanadas',
    nombre: 'Empanada Carne Cortada a Cuchillo',
    descripcion: 'Carne jugosa salteada con cebolla, morrón, huevo duro y especias tradicionales norteñas en masa casera.',
    precio: 1400.00,
    imagen_final: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80',
    disponible: true
  },
  {
    id: 106,
    categoria: 'empanadas',
    nombre: 'Empanada Jamón y Queso Fundido',
    descripcion: 'Mezcla cremosa de tres quesos seleccionados con trozos de jamón cocido de primera calidad.',
    precio: 1300.00,
    imagen_final: 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=600&q=80',
    disponible: true
  },
  {
    id: 107,
    categoria: 'drinks',
    nombre: 'Cerveza IPA Artesanal 500ml',
    descripcion: 'Lata 500ml ultra helada. Notas cítricas y resinosas con amargor balanceado.',
    precio: 3800.00,
    imagen_final: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=600&q=80',
    disponible: true
  },
  {
    id: 108,
    categoria: 'drinks',
    nombre: 'Gaseosa Coca-Cola Original 500ml',
    descripcion: 'Botella individual fría.',
    precio: 2200.00,
    imagen_final: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
    disponible: true
  },
  {
    id: 109,
    categoria: 'desserts',
    nombre: 'Volcán de Chocolate con Helado',
    descripcion: 'Bizcochuelo caliente con centro líquido fundido, acompañado de bocha de helado de crema americana.',
    precio: 4500.00,
    imagen_final: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    disponible: true
  }
];

export const INITIAL_ORDERS = [
  {
    id: 1042,
    cliente_nombre: 'Mariana López',
    telefono: '1154329876',
    mesa_o_direccion: 'Mesa 4',
    notas_cocina: 'Sin cebolla en la hamburguesa por favor',
    metodo_pago: 'EFECTIVO',
    estado_pago: 'PENDIENTE',
    estado_pedido: 'PENDIENTE',
    total: 10300.00,
    fecha_creacion: new Date(Date.now() - 5 * 60000).toISOString(),
    items: [
      { id: 1, producto_nombre: 'Smash Double Cheese Burger', cantidad: 1, precio_unitario: 8900.00, notas: 'Sin cebolla' },
      { id: 2, producto_nombre: 'Empanada Carne Cortada a Cuchillo', cantidad: 1, precio_unitario: 1400.00, notas: '' }
    ]
  },
  {
    id: 1043,
    cliente_nombre: 'Gonzalo Rossi',
    telefono: '1198765432',
    mesa_o_direccion: 'Mesa 12',
    notas_cocina: 'La cerveza bien helada',
    metodo_pago: 'MERCADO_PAGO',
    estado_pago: 'PAGADO',
    estado_pedido: 'EN_PREPARACION',
    total: 15000.00,
    fecha_creacion: new Date(Date.now() - 12 * 60000).toISOString(),
    items: [
      { id: 3, producto_nombre: 'Pizza Napolitana Premium', cantidad: 1, precio_unitario: 11200.00, notas: '' },
      { id: 4, producto_nombre: 'Cerveza IPA Artesanal 500ml', cantidad: 1, precio_unitario: 3800.00, notas: '' }
    ]
  },
  {
    id: 1044,
    cliente_nombre: 'Camila Benítez',
    telefono: '1144556677',
    mesa_o_direccion: 'Mesa 8',
    notas_cocina: '',
    metodo_pago: 'MERCADO_PAGO',
    estado_pago: 'PAGADO',
    estado_pedido: 'LISTO_PARA_RETIRAR',
    total: 13700.00,
    fecha_creacion: new Date(Date.now() - 22 * 60000).toISOString(),
    items: [
      { id: 5, producto_nombre: 'Tasty Bacon BBQ Crispy', cantidad: 1, precio_unitario: 9500.00, notas: '' },
      { id: 6, producto_nombre: 'Volcán de Chocolate con Helado', cantidad: 1, precio_unitario: 4200.00, notas: '' }
    ]
  }
];
