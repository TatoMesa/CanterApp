from rest_framework import serializers
from .models import Categoria, Producto, Pedido, ItemPedido

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'icono', 'orden', 'activa']


class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre', default='General')
    imagen_final = serializers.ReadOnlyField(source='get_imagen')

    class Meta:
        model = Producto
        fields = [
            'id', 'categoria', 'categoria_nombre', 'nombre', 
            'descripcion', 'precio', 'imagen_url', 'imagen', 
            'imagen_final', 'disponible', 'fecha_creacion'
        ]


# --- Read serializer: returns producto_nombre from the DB relation ---
class ItemPedidoReadSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.SerializerMethodField()

    class Meta:
        model = ItemPedido
        fields = ['id', 'producto_nombre', 'cantidad', 'precio_unitario', 'notas']

    def get_producto_nombre(self, obj):
        if obj.producto:
            return obj.producto.nombre
        return 'Producto'


# --- Write serializer: accepts producto_id + producto_nombre from frontend ---
class ItemPedidoWriteSerializer(serializers.Serializer):
    producto_id = serializers.IntegerField(required=False, default=1)
    producto_nombre = serializers.CharField(required=False, default='Producto')
    cantidad = serializers.IntegerField(required=False, default=1)
    precio_unitario = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0)
    notas = serializers.CharField(required=False, default='', allow_blank=True)


class PedidoCreateSerializer(serializers.ModelSerializer):
    items = ItemPedidoWriteSerializer(many=True)

    class Meta:
        model = Pedido
        fields = [
            'id', 'cliente_nombre', 'telefono', 'mesa_o_direccion', 
            'notas_cocina', 'metodo_pago', 'items'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Obtener o crear una categoría por defecto si no hay
        cat_default, _ = Categoria.objects.get_or_create(
            id=1,
            defaults={'nombre': 'General', 'icono': 'Utensils', 'orden': 0, 'activa': True}
        )

        pedido = Pedido.objects.create(**validated_data)
        
        total = 0
        for item_data in items_data:
            prod_id = item_data.get('producto_id', 1)
            prod_nombre = item_data.get('producto_nombre', 'Producto')
            precio = item_data.get('precio_unitario', 0.00)
            cantidad = item_data.get('cantidad', 1)
            notas = item_data.get('notas', '')

            # Buscar producto existente o crearlo dinámicamente si es necesario
            producto = Producto.objects.filter(id=prod_id).first()
            if not producto:
                producto = Producto.objects.create(
                    categoria=cat_default,
                    nombre=prod_nombre,
                    precio=precio,
                    disponible=True
                )

            ItemPedido.objects.create(
                pedido=pedido,
                producto=producto,
                cantidad=cantidad,
                precio_unitario=precio,
                notas=notas
            )
            total += float(precio) * cantidad

        pedido.total = total
        pedido.save()
        return pedido


class PedidoDetailSerializer(serializers.ModelSerializer):
    items = ItemPedidoReadSerializer(many=True, read_only=True)
    estado_pedido_display = serializers.ReadOnlyField(source='get_estado_pedido_display')
    estado_pago_display = serializers.ReadOnlyField(source='get_estado_pago_display')
    metodo_pago_display = serializers.ReadOnlyField(source='get_metodo_pago_display')

    class Meta:
        model = Pedido
        fields = [
            'id', 'cliente_nombre', 'telefono', 'mesa_o_direccion', 
            'notas_cocina', 'metodo_pago', 'metodo_pago_display',
            'estado_pago', 'estado_pago_display',
            'estado_pedido', 'estado_pedido_display', 
            'total', 'mp_preference_id', 'mp_init_point',
            'fecha_creacion', 'fecha_actualizacion', 'items'
        ]

