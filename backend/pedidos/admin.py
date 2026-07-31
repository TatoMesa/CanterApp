from django.contrib import admin
from .models import Categoria, Producto, Pedido, ItemPedido

class ItemPedidoInline(admin.TabularInline):
    model = ItemPedido
    extra = 0
    readonly_fields = ('subtotal',)


@admin.register(Categoria)
class CategoriaAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'icono', 'orden', 'activa')
    list_editable = ('orden', 'activa')
    search_fields = ('nombre',)


@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'categoria', 'precio', 'disponible', 'fecha_creacion')
    list_editable = ('precio', 'disponible')
    list_filter = ('categoria', 'disponible')
    search_fields = ('nombre', 'descripcion')


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'cliente_nombre', 'telefono', 'mesa_o_direccion', 
        'metodo_pago', 'estado_pago', 'estado_pedido', 'total', 'fecha_creacion'
    )
    list_filter = ('metodo_pago', 'estado_pago', 'estado_pedido', 'fecha_creacion')
    search_fields = ('cliente_nombre', 'telefono', 'mesa_o_direccion', 'id')
    inlines = [ItemPedidoInline]
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion')
