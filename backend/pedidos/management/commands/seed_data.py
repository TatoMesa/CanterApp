from django.core.management.base import BaseCommand
from pedidos.models import Categoria, Producto

class Command(BaseCommand):
    help = 'Poblar base de datos inicial con categorías y productos de CanterApp'

    def handle(self, *args, **options):
        self.stdout.write("Poblando categorías y productos...")

        cat_burgers, _ = Categoria.objects.get_or_create(nombre='Hamburguesas', defaults={'icono': 'Beef', 'orden': 1})
        cat_pizzas, _ = Categoria.objects.get_or_create(nombre='Pizzas & Mozza', defaults={'icono': 'Pizza', 'orden': 2})
        cat_empanadas, _ = Categoria.objects.get_or_create(nombre='Empanadas', defaults={'icono': 'Flame', 'orden': 3})
        cat_drinks, _ = Categoria.objects.get_or_create(nombre='Bebidas', defaults={'icono': 'CupSoda', 'orden': 4})
        cat_desserts, _ = Categoria.objects.get_or_create(nombre='Postres', defaults={'icono': 'IceCream', 'orden': 5})

        prods = [
            (101, cat_burgers, 'Smash Double Cheese Burger', 'Doble medalla smash 120g, cheddar, bacon y salsa Canter.', 8900.00, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600'),
            (102, cat_burgers, 'Tasty Bacon BBQ Crispy', 'Medalla vacuna 180g, queso muzzarella, aros de cebolla y bbq.', 9500.00, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600'),
            (103, cat_pizzas, 'Pizza Napolitana Premium', 'Salsa de tomate italiano, doble mozzarella y albahaca.', 11200.00, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600'),
            (104, cat_pizzas, 'Fugazzeta Rellena de Queso', 'Masa de fermentación lenta rellena de queso cremoso y cebolla.', 12500.00, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600'),
            (105, cat_empanadas, 'Empanada Carne Cortada a Cuchillo', 'Carne jugosa salteada con cebolla, morrón y huevo.', 1400.00, 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600'),
            (106, cat_empanadas, 'Empanada Jamón y Queso Fundido', 'Mezcla cremosa de tres quesos con jamón cocido.', 1300.00, 'https://images.unsplash.com/photo-1619895092538-128341789043?w=600'),
            (107, cat_drinks, 'Cerveza IPA Artesanal 500ml', 'Lata 500ml ultra helada con amargor balanceado.', 3800.00, 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600'),
            (108, cat_drinks, 'Gaseosa Coca-Cola Original 500ml', 'Botella individual fría.', 2200.00, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600'),
            (109, cat_desserts, 'Volcán de Chocolate con Helado', 'Bizcochuelo caliente con centro líquido y helado.', 4500.00, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600')
        ]

        for p_id, cat, nombre, desc, precio, img in prods:
            Producto.objects.update_or_create(
                id=p_id,
                defaults={
                    'categoria': cat,
                    'nombre': nombre,
                    'descripcion': desc,
                    'precio': precio,
                    'imagen_url': img,
                    'disponible': True
                }
            )

        self.stdout.write(self.style.SUCCESS("✅ Base de datos poblada exitosamente."))
