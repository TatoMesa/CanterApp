#!/bin/bash
echo "=========================================="
echo " DIAGNÓSTICO COMPLETO CANTERAPP"
echo "=========================================="

echo ""
echo ">>> 1. ¿Existe el directorio del backend?"
ls -la /var/www/canterapp/backend/

echo ""
echo ">>> 2. ¿Existe el archivo de migración?"
ls -la /var/www/canterapp/backend/pedidos/migrations/

echo ""
echo ">>> 3. ¿Existe la base de datos SQLite?"
ls -la /var/www/canterapp/backend/db.sqlite3 2>/dev/null || echo "NO EXISTE db.sqlite3"

echo ""
echo ">>> 4. Intentar migrate"
cd /var/www/canterapp/backend
./venv/bin/python manage.py migrate 2>&1

echo ""
echo ">>> 5. Intentar seed_data"
./venv/bin/python manage.py seed_data 2>&1

echo ""
echo ">>> 6. ¿Hay productos en la base de datos?"
./venv/bin/python manage.py shell -c "
from pedidos.models import Categoria, Producto, Pedido
print(f'Categorias: {Categoria.objects.count()}')
print(f'Productos: {Producto.objects.count()}')
print(f'Pedidos: {Pedido.objects.count()}')
" 2>&1

echo ""
echo ">>> 7. ¿Existe el servicio systemd canterapp?"
sudo systemctl status canterapp 2>&1 | head -20

echo ""
echo ">>> 8. ¿Existe el archivo del servicio systemd?"
cat /etc/systemd/system/canterapp.service 2>/dev/null || echo "NO EXISTE el archivo canterapp.service"

echo ""
echo ">>> 9. ¿Gunicorn responde en puerto 8005?"
curl -s -o /dev/null -w "HTTP_CODE: %{http_code}\n" http://127.0.0.1:8005/api/productos/ 2>&1 || echo "NO RESPONDE"

echo ""
echo ">>> 10. ¿Qué archivo wsgi.py existe?"
cat /var/www/canterapp/backend/config/wsgi.py 2>/dev/null || echo "NO EXISTE wsgi.py"

echo ""
echo ">>> 11. ¿Nginx config activa para canterapp?"
ls -la /etc/nginx/sites-enabled/ | grep -i canter 2>&1 || echo "NO HAY config nginx para canterapp"
cat /etc/nginx/sites-enabled/*canter* 2>/dev/null || echo "NO SE PUDO LEER la config"

echo ""
echo ">>> 12. ¿El frontend dist existe?"
ls -la /var/www/canterapp/frontend/dist/ 2>&1 | head -10

echo ""
echo ">>> 13. Probar Gunicorn manualmente"
cd /var/www/canterapp/backend
timeout 3 ./venv/bin/gunicorn config.wsgi:application --bind 127.0.0.1:9999 2>&1 &
sleep 2
curl -s -o /dev/null -w "GUNICORN_TEST HTTP_CODE: %{http_code}\n" http://127.0.0.1:9999/api/productos/ 2>&1
kill %1 2>/dev/null

echo ""
echo "=========================================="
echo " FIN DEL DIAGNÓSTICO"
echo "=========================================="
