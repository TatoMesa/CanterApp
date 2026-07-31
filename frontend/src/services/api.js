// Servicio de conexión con la API REST de Django Backend

const API_BASE = '/api';

export async function fetchProductos() {
  try {
    const res = await fetch(`${API_BASE}/productos/`);
    if (!res.ok) throw new Error('Error cargando productos');
    return await res.json();
  } catch (e) {
    console.warn('API Error (fetchProductos):', e);
    return null;
  }
}

export async function fetchCategorias() {
  try {
    const res = await fetch(`${API_BASE}/categorias/`);
    if (!res.ok) throw new Error('Error cargando categorías');
    return await res.json();
  } catch (e) {
    console.warn('API Error (fetchCategorias):', e);
    return null;
  }
}

export async function fetchPedidosCocina() {
  try {
    const res = await fetch(`${API_BASE}/pedidos/cocina/`);
    if (!res.ok) throw new Error('Error cargando comandas de cocina');
    return await res.json();
  } catch (e) {
    console.warn('API Error (fetchPedidosCocina):', e);
    return null;
  }
}

export async function crearPedidoAPI(pedidoData) {
  try {
    const payload = {
      cliente_nombre: pedidoData.cliente_nombre,
      telefono: pedidoData.telefono,
      mesa_o_direccion: pedidoData.mesa_o_direccion,
      notas_cocina: pedidoData.notas_cocina || '',
      metodo_pago: pedidoData.metodo_pago,
      items: pedidoData.items.map(item => ({
        producto_id: item.producto_id || item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario || item.precio,
        notas: item.notas || ''
      }))
    };

    const res = await fetch(`${API_BASE}/pedidos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(JSON.stringify(err));
    }
    return await res.json();
  } catch (e) {
    console.warn('API Error (crearPedidoAPI):', e);
    return null;
  }
}

export async function cambiarEstadoPedidoAPI(pedidoId, nuevoEstado) {
  try {
    const res = await fetch(`${API_BASE}/pedidos/${pedidoId}/cambiar-estado/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nuevo_estado: nuevoEstado })
    });
    if (!res.ok) throw new Error('Error cambiando estado');
    return await res.json();
  } catch (e) {
    console.warn('API Error (cambiarEstadoPedidoAPI):', e);
    return null;
  }
}
