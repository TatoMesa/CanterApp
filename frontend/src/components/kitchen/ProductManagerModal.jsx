import React, { useState } from 'react';
import { X, Plus, Edit2, Check, Power, Tag, Trash2 } from 'lucide-react';

export default function ProductManagerModal({ isOpen, onClose, products, categories, onSaveProduct, onToggleAvailability, onDeleteProduct }) {
  if (!isOpen) return null;

  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: categories[1]?.id || 'burgers',
    precio: '',
    descripcion: '',
    imagen_final: ''
  });

  const handleEditClick = (prod) => {
    setEditingProduct(prod);
    setFormData({
      nombre: prod.nombre,
      categoria: prod.categoria,
      precio: prod.precio,
      descripcion: prod.descripcion || '',
      imagen_final: prod.imagen_final || prod.imagen_url || ''
    });
  };

  const handleNewClick = () => {
    setEditingProduct({ isNew: true });
    setFormData({
      nombre: '',
      categoria: categories[1]?.id || 'burgers',
      precio: '',
      descripcion: '',
      imagen_final: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.precio) return;

    const savedProd = {
      id: editingProduct.isNew ? Date.now() : editingProduct.id,
      isNew: editingProduct.isNew,
      nombre: formData.nombre,
      categoria: formData.categoria,
      precio: parseFloat(formData.precio),
      descripcion: formData.descripcion,
      imagen_final: formData.imagen_final || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
      disponible: editingProduct.isNew ? true : editingProduct.disponible
    };

    onSaveProduct(savedProd);
    setEditingProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-3xl border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <h2 className="font-extrabold text-white text-lg flex items-center gap-2">
              <Tag className="w-5 h-5 text-brand-primary" /> Gestión de Productos del Menú (CRUD)
            </h2>
            <p className="text-xs text-slate-400 font-medium">Añade, edita precios, gestiona fotos o elimina platos del menú</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {editingProduct ? (
            /* Product Edit / Create Form */
            <form onSubmit={handleSave} className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="font-bold text-sm text-brand-primary">
                  {editingProduct.isNew ? '➕ Agregar Nuevo Producto' : '✏️ Editar Producto'}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="text-xs text-slate-400 hover:text-white font-bold"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Nombre del Plato *</label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Sándwich Triple Cheddar"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Precio (ARS) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    placeholder="Ej: 8500"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Categoría *</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-brand-primary"
                  >
                    {categories.filter(c => c.id !== 'all').map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">URL Imagen</label>
                  <input
                    type="url"
                    value={formData.imagen_final}
                    onChange={(e) => setFormData({ ...formData, imagen_final: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Descripción</label>
                <textarea
                  rows="2"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Ingredientes y detalles..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-brand-primary"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-brand-primary hover:bg-brand-dark text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <Check className="w-4 h-4" /> Guardar Producto
              </button>
            </form>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Catálogo ({products.length} productos)
                </span>
                <button
                  onClick={handleNewClick}
                  className="px-3 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-xl hover:bg-brand-dark flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Nuevo Producto
                </button>
              </div>

              {/* Product list table */}
              <div className="space-y-2">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <img src={prod.imagen_final || prod.imagen_url} alt={prod.nombre} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-white truncate">{prod.nombre}</h4>
                          <span className="text-[10px] bg-slate-800 text-slate-400 font-semibold px-2 py-0.5 rounded-full capitalize">
                            {prod.categoria_nombre || prod.categoria}
                          </span>
                        </div>
                        <p className="text-xs font-extrabold text-amber-400 mt-0.5">
                          ${Number(prod.precio).toLocaleString('es-AR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Availability Toggle Switch */}
                      <button
                        onClick={() => onToggleAvailability(prod.id, !prod.disponible)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all ${
                          prod.disponible
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                        }`}
                        title={prod.disponible ? 'Pausar plato' : 'Activar plato'}
                      >
                        <Power className="w-3 h-3" />
                        <span>{prod.disponible ? 'Activo' : 'Pausado'}</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleEditClick(prod)}
                        className="w-7 h-7 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      {onDeleteProduct && (
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Seguro que deseas eliminar "${prod.nombre}"?`)) {
                              onDeleteProduct(prod.id);
                            }
                          }}
                          className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 flex items-center justify-center transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
