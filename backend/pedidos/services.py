import mercadopago
from django.conf import settings

class MercadoPagoService:
    @staticmethod
    def crear_preferencia_pago(pedido):
        """
        Crea una preferencia de pago en Mercado Pago utilizando el SDK oficial.
        """
        sdk = mercadopago.SDK(settings.MERCADO_PAGO_ACCESS_TOKEN)

        items_mp = []
        for item in pedido.items.all():
            items_mp.append({
                "id": str(item.producto.id),
                "title": item.producto.nombre,
                "quantity": int(item.cantidad),
                "currency_id": "ARS",
                "unit_price": float(item.precio_unitario),
                "description": item.notas or f"Producto {item.producto.nombre}"
            })

        preference_data = {
            "items": items_mp,
            "payer": {
                "name": pedido.cliente_nombre,
                "phone": {
                    "number": pedido.telefono
                }
            },
            "back_urls": {
                "success": f"{settings.FRONTEND_URL}/pedido/{pedido.id}?status=success",
                "failure": f"{settings.FRONTEND_URL}/pedido/{pedido.id}?status=failure",
                "pending": f"{settings.FRONTEND_URL}/pedido/{pedido.id}?status=pending"
            },
            "auto_return": "approved",
            "notification_url": settings.MERCADO_PAGO_WEBHOOK_URL,
            "external_reference": str(pedido.id),
            "statement_descriptor": "CANTERAPP RESTO"
        }

        try:
            preference_response = sdk.preference().create(preference_data)
            preference = preference_response["response"]
            
            # Guardar datos de MP en el pedido
            pedido.mp_preference_id = preference.get("id")
            pedido.mp_init_point = preference.get("init_point")
            pedido.save(update_fields=['mp_preference_id', 'mp_init_point'])

            return {
                "preference_id": preference.get("id"),
                "init_point": preference.get("init_point"),
                "sandbox_init_point": preference.get("sandbox_init_point")
            }
        except Exception as e:
            # Si las credenciales son de prueba o hay un error de conexión, simular la respuesta
            simulated_init_point = f"https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=TEST-{pedido.id}"
            pedido.mp_preference_id = f"TEST-PREF-{pedido.id}"
            pedido.mp_init_point = simulated_init_point
            pedido.save(update_fields=['mp_preference_id', 'mp_init_point'])
            
            return {
                "preference_id": f"TEST-PREF-{pedido.id}",
                "init_point": simulated_init_point,
                "error": str(e)
            }

    @staticmethod
    def obtener_informacion_pago(payment_id):
        """
        Obtiene los detalles del pago directamente desde la API de Mercado Pago.
        """
        sdk = mercadopago.SDK(settings.MERCADO_PAGO_ACCESS_TOKEN)
        try:
            payment_info = sdk.payment().get(payment_id)
            return payment_info.get("response", {})
        except Exception:
            return None
