#!/bin/bash
# Script de despliegue automatizado para DigitalOcean
# Dominio: CanterApp.nexusstudiocode.online

set -e

echo "🚀 Iniciando despliegue de CanterApp..."

# 1. Actualizar sistema e instalar paquetes base
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv nginx git certbot python3-certbot-nginx nodejs npm

# 2. Configurar directorio del proyecto
PROJECT_DIR="/var/www/canterapp"
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR

# (Copiar o clonar repositorio aquí)

# 3. Configurar Backend Django
cd $PROJECT_DIR/backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt gunicorn

python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput

# 4. Configurar Frontend React
cd $PROJECT_DIR/frontend
npm install
npm run build

echo "✅ Proyecto compilado con éxito."
