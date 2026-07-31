from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('icono', models.CharField(default='Utensils', max_length=50)),
                ('orden', models.PositiveIntegerField(default=0)),
                ('activa', models.BooleanField(default=True)),
            ],
            options={
                'verbose_name': 'Categoría',
                'verbose_name_plural': 'Categorías',
                'ordering': ['orden', 'nombre'],
            },
        ),
        migrations.CreateModel(
            name='Pedido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cliente_nombre', models.CharField(max_length=100, verbose_name='Nombre del Cliente')),
                ('telefono', models.CharField(max_length=20, verbose_name='Teléfono / WhatsApp')),
                ('mesa_o_direccion', models.CharField(max_length=150, verbose_name='Mesa N° / Dirección de Entrega')),
                ('notas_cocina', models.TextField(blank=True, null=True, verbose_name='Aclaraciones para la Cocina')),
                ('metodo_pago', models.CharField(choices=[('EFECTIVO', 'Efectivo en Mostrador / Al Retirar'), ('MERCADO_PAGO', 'Mercado Pago (Tarjeta / Dinero en Cuenta)')], default='EFECTIVO', max_length=20)),
                ('estado_pago', models.CharField(choices=[('PENDIENTE', 'Pendiente'), ('PAGADO', 'Pagado'), ('RECHAZADO', 'Rechazado')], default='PENDIENTE', max_length=20)),
                ('estado_pedido', models.CharField(choices=[('PENDIENTE', 'Pendiente'), ('EN_PREPARACION', 'En Preparación'), ('LISTO_PARA_RETIRAR', '¡Listo para Retirar!'), ('ENTREGADO', 'Entregado'), ('CANCELADO', 'Cancelado')], default='PENDIENTE', max_length=25)),
                ('total', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('mp_preference_id', models.CharField(blank=True, max_length=200, null=True)),
                ('mp_payment_id', models.CharField(blank=True, max_length=200, null=True)),
                ('mp_init_point', models.URLField(blank=True, max_length=500, null=True)),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('fecha_actualizacion', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Pedido',
                'verbose_name_plural': 'Pedidos',
                'ordering': ['-fecha_creacion'],
            },
        ),
        migrations.CreateModel(
            name='Producto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=150)),
                ('descripcion', models.TextField(blank=True)),
                ('precio', models.DecimalField(decimal_places=2, max_digits=10)),
                ('imagen_url', models.URLField(blank=True, max_length=500, null=True)),
                ('imagen', models.ImageField(blank=True, null=True, upload_to='productos/')),
                ('disponible', models.BooleanField(default=True)),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('categoria', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='productos', to='pedidos.categoria')),
            ],
            options={
                'verbose_name': 'Producto',
                'verbose_name_plural': 'Productos',
                'ordering': ['categoria', 'nombre'],
            },
        ),
        migrations.CreateModel(
            name='ItemPedido',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cantidad', models.PositiveIntegerField(default=1)),
                ('precio_unitario', models.DecimalField(decimal_places=2, max_digits=10)),
                ('notas', models.CharField(blank=True, max_length=255, null=True)),
                ('pedido', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='pedidos.pedido')),
                ('producto', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='pedidos.producto')),
            ],
            options={
                'verbose_name': 'Ítem de Pedido',
                'verbose_name_plural': 'Ítems de Pedidos',
            },
        ),
    ]
