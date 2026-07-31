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
      cliente_nombre: pedidoData.cliente_nombre || 'Cliente',
      telefono: pedidoData.telefono || '1100000000',
      mesa_o_direccion: pedidoData.mesa_o_direccion || 'Retira en mostrador',
      notas_cocina: pedidoData.notas_cocina || '',
      metodo_pago: pedidoData.metodo_pago || 'EFECTIVO',
      items: pedidoData.items.map(item => ({
        producto_id: parseInt(item.producto_id || item.id || 1),
        producto_nombre: item.producto_nombre || item.nombre || 'Producto',
        cantidad: parseInt(item.cantidad || 1),
        precio_unitario: parseFloat(item.precio_unitario || item.precio || 0).toFixed(2),
        notas: item.notas || ''
      }))
    };

    const res = await fetch(`${API_BASE}/pedidos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Error al crear pedido en Django:', errText);
      alert('Error en el servidor Django al guardar el pedido: ' + errText);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error('API Error (crearPedidoAPI):', e);
    alert('Error de conexión con el backend: ' + e.message);
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

// *** CRUD DE PRODUCTOS (Backend Django Sync) ***

export async function guardarProductoAPI(productData) {
  try {
    const isNew = !productData.id || productData.isNew || typeof productData.id !== 'number' || productData.id > 1000000;
    const url = isNew ? `${API_BASE}/productos/` : `${API_BASE}/productos/${productData.id}/`;
    const method = isNew ? 'POST' : 'PUT';

    // Asegurar ID de categoría válido
    let catId = 1;
    if (typeof productData.categoria === 'number') {
      catId = productData.categoria;
    }

    const payload = {
      categoria: catId,
      nombre: productData.nombre,
      descripcion: productData.descripcion || '',
      precio: parseFloat(productData.precio || 0).toFixed(2),
      imagen_url: productData.imagen_final || productData.imagen_url || '',
      disponible: productData.disponible !== undefined ? productData.disponible : true
    };

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Error guardando producto:', errText);
      alert('Error en el servidor al guardar el producto: ' + errText);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error('API Error (guardarProductoAPI):', e);
    return null;
  }
}

export async function toggleDisponibilidadAPI(productId, disponible) {
  try {
    const res = await fetch(`${API_BASE}/productos/${productId}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disponible })
    });
    if (!res.ok) throw new Error('Error cambiando disponibilidad');
    return await res.json();
  } catch (e) {
    console.warn('API Error (toggleDisponibilidadAPI):', e);
    return null;
  }
}

export async function eliminarProductoAPI(productId) {
  try {
    const res = await fetch(`${API_BASE}/productos/${productId}/`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (e) {
    console.warn('API Error (eliminarProductoAPI):', e);
    return false;
  }
}
