from rest_framework import serializers
from .models import Categoria, Producto, Pedido, ItemPedido

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'icono', 'orden', 'activa']


class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.ReadOnlyField(source='categoria.nombre')
    imagen_final = serializers.ReadOnlyField(source='get_imagen')

    class Meta:
        model = Producto
        fields = [
            'id', 'categoria', 'categoria_nombre', 'nombre', 
            'descripcion', 'precio', 'imagen_url', 'imagen', 
            'imagen_final', 'disponible', 'fecha_creacion'
        ]


class ItemPedidoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.ReadOnlyField(source='producto.nombre')
    producto_id = serializers.PrimaryKeyRelatedField(
        queryset=Producto.objects.all(), source='producto'
    )
    subtotal = serializers.ReadOnlyField()

    class Meta:
        model = ItemPedido
        fields = ['id', 'producto_id', 'producto_nombre', 'cantidad', 'precio_unitario', 'notas', 'subtotal']


class PedidoCreateSerializer(serializers.ModelSerializer):
    items = ItemPedidoSerializer(many=True)

    class Meta:
        model = Pedido
        fields = [
            'id', 'cliente_nombre', 'telefono', 'mesa_o_direccion', 
            'notas_cocina', 'metodo_pago', 'items'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Crear pedido inicialmente con total 0
        pedido = Pedido.objects.create(**validated_data)
        
        total = 0
        for item_data in items_data:
            producto = item_data['producto']
            cantidad = item_data['cantidad']
            precio = producto.precio  # Usar precio actual del producto
            notas = item_data.get('notas', '')
            
            ItemPedido.objects.create(
                pedido=pedido,
                producto=producto,
                cantidad=cantidad,
                precio_unitario=precio,
                notas=notas
            )
            total += precio * cantidad

        pedido.total = total
        pedido.save()
        return pedido


class PedidoDetailSerializer(serializers.ModelSerializer):
    items = ItemPedidoSerializer(many=True, read_only=True)
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
