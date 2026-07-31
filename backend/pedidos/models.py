from django.db import models

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)
    icono = models.CharField(max_length=50, default='Utensils', help_text="Nombre de icono Lucide para el menú visual")
    orden = models.PositiveIntegerField(default=0)
    activa = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'
        ordering = ['orden', 'nombre']

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE, related_name='productos')
    nombre = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    imagen_url = models.URLField(max_length=500, blank=True, null=True, help_text="URL de la imagen del producto")
    imagen = models.ImageField(upload_to='productos/', blank=True, null=True)
    disponible = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'
        ordering = ['categoria', 'nombre']

    def __str__(self):
        return f"{self.nombre} (${self.precio})"

    @property
    def get_imagen(self):
        if self.imagen:
            return self.imagen.url
        return self.imagen_url or "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"


class Pedido(models.Model):
    METODO_PAGO_CHOICES = [
        ('EFECTIVO', 'Efectivo en Mostrador / Al Retirar'),
        ('MERCADO_PAGO', 'Mercado Pago (Tarjeta / Dinero en Cuenta)'),
    ]

    ESTADO_PAGO_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('PAGADO', 'Pagado'),
        ('RECHAZADO', 'Rechazado'),
    ]

    ESTADO_PEDIDO_CHOICES = [
        ('PENDIENTE', 'Pendiente'),
        ('EN_PREPARACION', 'En Preparación'),
        ('LISTO_PARA_RETIRAR', '¡Listo para Retirar!'),
        ('ENTREGADO', 'Entregado'),
        ('CANCELADO', 'Cancelado'),
    ]

    cliente_nombre = models.CharField(max_length=100, verbose_name="Nombre del Cliente")
    telefono = models.CharField(max_length=20, verbose_name="Teléfono / WhatsApp")
    mesa_o_direccion = models.CharField(max_length=150, verbose_name="Mesa N° / Dirección de Entrega")
    notas_cocina = models.TextField(blank=True, null=True, verbose_name="Aclaraciones para la Cocina")
    
    metodo_pago = models.CharField(max_length=20, choices=METODO_PAGO_CHOICES, default='EFECTIVO')
    estado_pago = models.CharField(max_length=20, choices=ESTADO_PAGO_CHOICES, default='PENDIENTE')
    estado_pedido = models.CharField(max_length=25, choices=ESTADO_PEDIDO_CHOICES, default='PENDIENTE')
    
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Campos opcionales para integración con Mercado Pago
    mp_preference_id = models.CharField(max_length=200, blank=True, null=True)
    mp_payment_id = models.CharField(max_length=200, blank=True, null=True)
    mp_init_point = models.URLField(max_length=500, blank=True, null=True)

    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'
        ordering = ['-fecha_creacion']

    def __str__(self):
        return f"Pedido #{self.id} - {self.cliente_nombre} ({self.get_estado_pedido_display()})"


class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='items')
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT)
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    notas = models.CharField(max_length=255, blank=True, null=True, help_text="Ej: Sin cebolla, extra queso")

    class Meta:
        verbose_name = 'Ítem de Pedido'
        verbose_name_plural = 'Ítems de Pedidos'

    def __str__(self):
        return f"{self.cantidad}x {self.producto.nombre} (Pedido #{self.pedido.id})"

    @property
    def subtotal(self):
        return self.cantidad * self.precio_unitario
