# CanterApp 🍔 - Sistema Full-Stack Mobile-First de Pedidos de Comida y Tablero KDS

CanterApp es una solución web accesible principalmente desde dispositivos móviles (Cliente) y tableros KDS estilo Trello/Kanban para la cocina. Permite a los comensales visualizar el menú, armar su carrito, seleccionar entre pago en **Efectivo** o **Mercado Pago** y seguir el estado de su pedido en tiempo real con alertas sonoras y hápticas.

---

## 🛠️ Tecnologías Utilizadas

- **Backend:** Python + Django 5 + Django REST Framework (DRF)
- **Integraciones:** Mercado Pago SDK (`mercadopago`), Webhooks IPN
- **Frontend:** React 18 + Vite + Tailwind CSS + Lucide Icons + Web Audio API
- **Diseño UI/UX:** Mobile-First inspirado en PedidosYa para clientes y Kanban/Trello para la cocina.

---

## 🚀 Instrucciones de Instalación y Ejecución

### 1. Backend (Django REST Framework)

```bash
# Acceder a la carpeta backend
cd backend

# Crear entorno virtual (opcional pero recomendado)
python -m venv venv
# En Windows:
venv\Scripts\activate
# En Linux/macOS:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Aplicar migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario para el panel de administración
python manage.py createsuperuser

# Iniciar servidor de desarrollo en http://127.0.0.1:8000
python manage.py runserver
```

### 2. Frontend (React + Vite)

```bash
# Acceder a la carpeta frontend
cd frontend

# Instalar dependencias npm
npm install

# Iniciar servidor de desarrollo en http://localhost:5173
npm run dev
```

---

## 📱 Funcionalidades del Sistema

### 1. Vista Cliente (Estilo PedidosYa):
- **Menú Visual:** Buscador y chips horizontales de categorías con iconos.
- **Tarjetas de Platos:** Fotos de alta calidad, precio destacado, descripción y botón táctil `+` / `-` de agregado rápido.
- **Barra Flotante Inferior:** Barra fija al fondo con contador de productos y total acumulado.
- **Checkout & Selección de Pago:** Formulario para Nombre, Mesa/Dirección, Aclaraciones y elección entre **Efectivo** (cobro en mostrador) y **Mercado Pago** (link de pago/preferencia).
- **Seguimiento en Vivo:** Stepper interactivo de estado (*Recibido -> En Preparación -> ¡Listo para Retirar!*) con **alerta sonora** (Web Audio API) y **vibración nativa**.

### 2. Vista Cocina / KDS (Tablero Estilo Trello):
- **Tablero Kanban 3 Columnas:**
  - 🟡 **Pendientes:** Tarjetas con temporizador y distintivo claro de método de pago (*EFECTIVO - Cobrar en Mostrador* vs *MERCADO PAGO - Pagado*).
  - 🔵 **En Preparación:** Comandas activas con lista de ítems en tipografía de alta visibilidad.
  - 🟢 **Listos para Retirar:** Tarjetas destacadas en verde.
- **Botón Táctil "Avisar pedido listo":** Notifica inmediatamente al cliente y reproduce la chime de aviso.
- **Gestión de Menú (CRUD):** Modal para agregar nuevos productos, cambiar precios o pausar disponibilidad.

---

## 💳 Integración con Mercado Pago SDK

El servicio `backend/pedidos/services.py` utiliza la librería oficial `mercadopago.SDK` para generar preferencias de pago seguras y recibir notificaciones Webhook en `POST /api/webhooks/mercadopago/` para actualizar el estado del pago automáticamente.
