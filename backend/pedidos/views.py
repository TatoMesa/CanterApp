from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction

from .models import Categoria, Producto, Pedido
from .serializers import (
    CategoriaSerializer, 
    ProductoSerializer, 
    PedidoCreateSerializer, 
    PedidoDetailSerializer
)
from .services import MercadoPagoService


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

    def get_queryset(self):
        if self.action == 'list':
            return Categoria.objects.filter(activa=True).order_by('orden')
        return super().get_queryset()


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all().order_by('categoria', 'nombre')
    serializer_class = ProductoSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        solo_disponibles = self.request.query_params.get('solo_disponibles', None)
        categoria_id = self.request.query_params.get('categoria', None)

        if solo_disponibles == 'true':
            queryset = queryset.filter(disponible=True)
        if categoria_id:
            queryset = queryset.filter(categoria_id=categoria_id)

        return queryset


class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all().order_by('-fecha_creacion')

    def get_serializer_class(self):
        if self.action == 'create':
            return PedidoCreateSerializer
        return PedidoDetailSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        with transaction.atomic():
            pedido = serializer.save()
            
            # Lógica de Pago
            mp_data = None
            if pedido.metodo_pago == 'MERCADO_PAGO':
                mp_data = MercadoPagoService.crear_preferencia_pago(pedido)
            elif pedido.metodo_pago == 'EFECTIVO':
                pedido.estado_pago = 'PENDIENTE'
                pedido.save()

        response_serializer = PedidoDetailSerializer(pedido)
        data = response_serializer.data
        if mp_data:
            data['mercado_pago'] = mp_data

        return Response(data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='cocina')
    def list_cocina(self, request):
        """
        Obtiene los pedidos activos para el tablero KDS / Trello de Cocina
        (Pendientes, En Preparación, Listos para Retirar)
        """
        pedidos_activos = Pedido.objects.exclude(estado_pedido__in=['ENTREGADO', 'CANCELADO']).order_by('fecha_creacion')
        serializer = PedidoDetailSerializer(pedidos_activos, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='cambiar-estado')
    def cambiar_estado(self, request, pk=None):
        """
        Endpoint que utiliza la cocina para cambiar el estado del pedido:
        PENDIENTE -> EN_PREPARACION -> LISTO_PARA_RETIRAR -> ENTREGADO
        """
        pedido = self.get_object()
        nuevo_estado = request.data.get('nuevo_estado')

        estados_validos = [choice[0] for choice in Pedido.ESTADO_PEDIDO_CHOICES]
        if nuevo_estado not in estados_validos:
            return Response(
                {"error": f"Estado inválido. Debe ser uno de: {estados_validos}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        pedido.estado_pedido = nuevo_estado
        
        # Si se entregó un pedido con pago en efectivo, se asume cobrado
        if nuevo_estado == 'ENTREGADO' and pedido.metodo_pago == 'EFECTIVO':
            pedido.estado_pago = 'PAGADO'

        pedido.save()

        serializer = PedidoDetailSerializer(pedido)
        return Response({
            "mensaje": f"Estado actualizado a {pedido.get_estado_pedido_display()}",
            "pedido": serializer.data
        })

    @action(detail=True, methods=['get'], url_path='estado')
    def estado(self, request, pk=None):
        """
        Endpoint liviano de polling para que la vista del cliente verifique cambios de estado.
        """
        pedido = self.get_object()
        return Response({
            "id": pedido.id,
            "estado_pedido": pedido.estado_pedido,
            "estado_pedido_display": pedido.get_estado_pedido_display(),
            "estado_pago": pedido.estado_pago,
            "es_listo": pedido.estado_pedido == 'LISTO_PARA_RETIRAR'
        })


class MercadoPagoWebhookView(APIView):
    """
    Webhook / Notificación IPN enviada por Mercado Pago tras realizar un pago.
    """
    def post(self, request, *args, **kwargs):
        data = request.data
        action_type = data.get("type") or data.get("topic")

        if action_type == "payment":
            payment_id = data.get("data", {}).get("id") or data.get("id")
            if payment_id:
                payment_info = MercadoPagoService.obtener_informacion_pago(payment_id)
                if payment_info:
                    external_reference = payment_info.get("external_reference")
                    status_mp = payment_info.get("status")

                    if external_reference:
                        try:
                            pedido = Pedido.objects.get(id=external_reference)
                            pedido.mp_payment_id = str(payment_id)
                            
                            if status_mp == "approved":
                                pedido.estado_pago = "PAGADO"
                            elif status_mp in ["rejected", "cancelled"]:
                                pedido.estado_pago = "RECHAZADO"

                            pedido.save()
                        except Pedido.DoesNotExist:
                            pass

        return Response({"status": "ok"}, status=status.HTTP_200_OK)
