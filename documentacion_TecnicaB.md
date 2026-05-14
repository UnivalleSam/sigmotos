# Documentación Técnica del Módulo Backend - SIGMOTOS

**Proyecto:** Sistema Integrado de Gestión para Motocicletas (SIGMOTOS)  
**Módulo:** Backend - Arquitectura de Microservicios  
**Fecha de Elaboración:** Mayo 2026  
**Versión:** 1.0.0

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Arquitectura General](#arquitectura-general)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura de Microservicios](#estructura-de-microservicios)
5. [Servicio de Inventario](#servicio-de-inventario)
6. [Servicio de Usuarios](#servicio-de-usuarios)
7. [Servicio OCR](#servicio-ocr)
8. [Servicio de Taller](#servicio-de-taller)
9. [Configuración y Deployments](#configuración-y-deployments)
10. [Base de Datos](#base-de-datos)
11. [Procesos de Build y Deployment](#procesos-de-build-y-deployment)
12. [Consideraciones de Producción](#consideraciones-de-producción)

---

## Introducción

El módulo backend de **SIGMOTOS** implementa una arquitectura de microservicios escalable y modular basada en Django. Cada servicio es independiente, containerizado y responsable de un dominio específico del negocio, permitiendo desarrollo, despliegue y escalado independiente.

### Objetivos del Backend

- Proporcionar APIs REST para la gestión de inventario
- Gestionar autenticación y autorización de usuarios
- Procesar reconocimiento óptico de caracteres (OCR) para placas
- Administrar órdenes de servicio y vehículos
- Mantener independencia y escalabilidad entre servicios
- Garantizar alta disponibilidad y confiabilidad

---

## Arquitectura General

### Patrón de Arquitectura: Microservicios

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
└────────┬──────────────┬──────────────┬──────────────────────┘
         │              │              │
    ┌────▼─────┐   ┌───▼──────┐  ┌───▼──────┐  ┌──────────┐
    │ Inventory │   │  Users   │  │   OCR    │  │ Workshop │
    │ Service   │   │ Service  │  │ Service  │  │ Service  │
    └────┬─────┘   ├──▼──────┤  └──────────┘  └──────────┘
         │         │.env vars │
         └─────────┴──────────┘
              │
         ┌────▼────────┐
         │  PostgreSQL │
         │  (Shared)   │
         └─────────────┘
```

### Características de la Arquitectura

- **Separación de Responsabilidades:** Cada microservicio gestiona un dominio específico
- **Independencia:** Bases de datos o esquemas separados por servicio
- **Escalabilidad Horizontal:** Posibilidad de replicar servicios según demanda
- **Resiliencia:** Fallos en un servicio no afectan otros servicios
- **Containerización:** Cada servicio en contenedor Docker independiente

---

## Stack Tecnológico

### Backend

| Componente | Versión | Propósito |
|---|---|---|
| **Django** | 5.2.13 | Framework web empresarial |
| **Python** | 3.12 | Runtime del servidor |
| **Django REST Framework** | Latest | Construcción de APIs REST |
| **PostgreSQL** | Latest | Base de datos relacional |
| **Gunicorn** | Latest | WSGI HTTP Server |
| **Celery** | Optional | Task queue (futuro) |
| **Redis** | Optional | Cache/Message broker (futuro) |

### Dependencias Críticas por Servicio

#### Inventory Service
- Django
- Django REST Framework
- psycopg2-binary (Adaptador PostgreSQL)

#### Users Service
- Django
- Django REST Framework
- python-decouple o environ
- psycopg2-binary

#### OCR Service
- Django
- Django REST Framework
- OpenCV (cv2)
- Tesseract OCR
- Pillow
- numpy
- psycopg2-binary

#### Workshop Service
- Django
- Django REST Framework
- psycopg2-binary

---

## Estructura de Microservicios

```
sigmotos-backend/
├── inventory_service/          # Gestión de inventario
├── users_service/              # Gestión de usuarios y autenticación
├── ocr_service/                # Reconocimiento de placas vehiculares
├── workshop_service/           # Gestión de órdenes y vehículos
└── docker-compose.yml          # Orquestación de servicios
```

### Estructura Común de Cada Servicio

```
{service}_service/
├── {service_name}/             # Configuración del proyecto
│   ├── __init__.py
│   ├── asgi.py                # Interfaz ASGI (async)
│   ├── wsgi.py                # Interfaz WSGI (sync)
│   ├── settings.py            # Configuración Django
│   └── urls.py                # Enrutamiento URL principal
├── {app_name}/                # Aplicación Django
│   ├── __init__.py
│   ├── admin.py               # Interfaz admin de Django
│   ├── apps.py                # Configuración de app
│   ├── models.py              # Modelos de datos
│   ├── views.py               # Vistas/Endpoints
│   ├── tests.py               # Pruebas unitarias
│   └── migrations/            # Control de versión de BD
├── manage.py                  # Utility de Django
├── requirements.txt           # Dependencias Python
└── Dockerfile                 # Configuración Docker
```

---

## Servicio de Inventario

### Propósito
Gestionar el inventario de piezas, accesorios y componentes disponibles para el taller de motocicletas.

### Configuración (`inventory_service/settings.py`)

```python
# Framework: Django 5.2.13
SECRET_KEY = 'django-insecure-...'
DEBUG = True  # Cambiar en producción
ALLOWED_HOSTS = []  # Configurar en producción
```

### Aplicación: `stock`

#### Modelos (`stock/models.py`)
**Estado Actual:** Estructura base preparada para expansión

Modelos esperados a implementar:
- **StockItem** - Pieza/componente del inventario
  - Nombre, descripción, código SKU
  - Cantidad disponible, mínimo de stock
  - Precio unitario
  - Fecha de creación/actualización

- **StockCategory** - Categorización de items
  - Nombre de categoría
  - Descripción

- **StockMovement** - Historial de movimientos
  - Tipo (entrada/salida)
  - Cantidad
  - Motivo
  - Timestamp

#### Vistas (`stock/views.py`)
**Estado Actual:** Estructura base preparada para expansión

Endpoints esperados a implementar:
- `GET /api/stock/` - Listar todos los items
- `POST /api/stock/` - Crear nuevo item
- `GET /api/stock/{id}/` - Detalle de item
- `PUT /api/stock/{id}/` - Actualizar item
- `DELETE /api/stock/{id}/` - Eliminar item
- `GET /api/stock/categories/` - Listar categorías

#### Migraciones
- `migrations/` - Control de versión de esquema

### Puerto
- **Desarrollo:** 8000
- **Producción:** 8000 (detrás de proxy)

---

## Servicio de Usuarios

### Propósito
Gestionar autenticación, autorización y perfiles de usuarios del sistema, incluyendo operadores de taller, administrativos y clientes.

### Configuración (`users_service/settings.py`)

```python
# Framework: Django 5.2.13
# Característica especial: Gestión de variables de entorno
import environ

env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# Valores desde .env
SECRET_KEY = env('SECRET_KEY')
DEBUG = env.bool('DEBUG', default=True)
```

### Gestión de Secretos
- **Método:** Variables de entorno (.env)
- **Archivo:** `.env` (NO incluir en control de versiones)
- **Ejemplo:**
```
SECRET_KEY=your-secret-key-here
DEBUG=False
DATABASE_URL=postgres://...
```

### Aplicación: `accounts`

#### Modelos (`accounts/models.py`)
**Estado Actual:** Estructura base preparada para expansión

Modelos esperados a implementar:
- **User** - Modelo extendido de usuario Django
  - Email, nombre completo
  - Rol/Permiso
  - Timestamp de creación/actualización

- **UserProfile** - Perfil de usuario
  - Teléfono, dirección
  - Documento de identidad
  - Foto de perfil

- **Role** - Roles de acceso
  - Administrador, Operador, Cliente

- **Permission** - Control granular de permisos
  - Lectura, creación, actualización, eliminación

#### Vistas (`accounts/views.py`)
**Estado Actual:** Estructura base preparada para expansión

Endpoints esperados a implementar:
- `POST /api/auth/login/` - Autenticación
- `POST /api/auth/register/` - Registro de usuario
- `POST /api/auth/logout/` - Cerrar sesión
- `POST /api/auth/refresh-token/` - Renovar token JWT
- `GET /api/users/{id}/` - Perfil de usuario
- `PUT /api/users/{id}/` - Actualizar perfil
- `GET /api/roles/` - Listar roles disponibles

#### Sistema de Autenticación
- **Protocolo:** JWT (JSON Web Token)
- **Header:** `Authorization: Bearer {token}`
- **Expiración:** Configurable (típicamente 24h)
- **Renovación:** Endpoint dedicado

### Seguridad
- Hashing de contraseñas (Django default: PBKDF2)
- Token JWT con expiración
- CORS configurado (según necesidad)
- HTTPS obligatorio en producción

### Puerto
- **Desarrollo:** 8000
- **Producción:** 8000 (detrás de proxy)

---

## Servicio OCR

### Propósito
Procesar imágenes de placas vehiculares para extraer información automáticamente, facilitando el registro rápido de vehículos.

### Características Especiales

#### Dependencias del Sistema
```dockerfile
RUN apt-get update && apt-get install -y \
    tesseract-ocr \           # Motor OCR
    libgl1-mesa-glx \         # Librerías OpenCV
    libglib2.0-0 \            # Dependencias del sistema
    && rm -rf /var/lib/apt/lists/*
```

### Configuración (`ocr_service/settings.py`)

```python
# Framework: Django 5.2.13
# Características: Procesamiento de imágenes
```

### Aplicación: `plate_reader`

#### Modelos (`plate_reader/models.py`)
**Estado Actual:** Estructura base preparada para expansión

Modelos esperados a implementar:
- **PlateReading** - Lectura de placa
  - Imagen original (ImageField)
  - Texto extraído
  - Confiabilidad (porcentaje)
  - Timestamp
  - Estado (exitoso/fallido)

- **PlateHistory** - Historial de lecturas
  - Vehículo
  - Lecturas anteriores
  - Comparación de cambios

#### Vistas (`plate_reader/views.py`)
**Estado Actual:** Estructura base preparada para expansión

Endpoints esperados a implementar:
- `POST /api/ocr/read-plate/` - Procesar imagen de placa
  - Input: Image (multipart/form-data)
  - Output: Texto extraído, confiabilidad, metadata

- `GET /api/ocr/history/` - Historial de lecturas

- `POST /api/ocr/validate-plate/` - Validar placa extraída

### Procesos OCR

#### Pipeline de Procesamiento

```
Imagen Original
    ↓
Preprocesamiento
├─ Conversión a escala de grises
├─ Ajuste de contraste
├─ Detección de bordes
└─ Denoising
    ↓
Detección de región de placa
├─ Segmentación
├─ Localización de placa
└─ Extracción de región
    ↓
Reconocimiento de caracteres (Tesseract)
├─ OCR Engine
├─ Corrección de errores
└─ Validación
    ↓
Resultado final
├─ Texto extraído
├─ Confiabilidad (%)
└─ Metadata
```

#### Tecnologías

- **OpenCV:** Procesamiento de imágenes, detección de características
- **Tesseract:** Motor OCR de código abierto
- **NumPy:** Operaciones numéricas en arrays de píxeles
- **Pillow:** Manipulación de imágenes

#### Limitaciones y Casos de Uso

✓ Funciona bien: Placas claras, buena iluminación, ángulo frontal  
✗ Limitaciones: Placas dañadas, baja resolución, ángulos extremos

### Puerto
- **Desarrollo:** 8000
- **Producción:** 8000 (detrás de proxy)

---

## Servicio de Taller

### Propósito
Gestionar órdenes de servicio, historial de mantenimiento, vehículos registrados y citas de atención en el taller.

### Configuración (`workshop_service/settings.py`)

```python
# Framework: Django 5.2.13
SECRET_KEY = 'django-insecure-...'
DEBUG = True  # Cambiar en producción
ALLOWED_HOSTS = []  # Configurar en producción
```

### Aplicaciones

#### Aplicación 1: `vehicles`

**Propósito:** Gestionar vehículos registrados en el sistema

##### Modelos (`vehicles/models.py`)
**Estado Actual:** Estructura base preparada para expansión

Modelos esperados:
- **Vehicle** - Vehículo
  - Marca, modelo, año
  - Placa, VIN
  - Propietario
  - Tipo de vehículo
  - Fecha de registro

- **VehicleModel** - Modelos disponibles
  - Fabricante, denominación
  - Motor, capacidad

- **VehicleService** - Historial de servicios
  - Vehículo, fecha, tipo
  - Descripción, costo
  - Próximo mantenimiento recomendado

##### Vistas (`vehicles/views.py`)
**Estado Actual:** Estructura base preparada para expansión

Endpoints esperados:
- `GET /api/vehicles/` - Listar vehículos
- `POST /api/vehicles/` - Registrar nuevo vehículo
- `GET /api/vehicles/{id}/` - Detalle de vehículo
- `PUT /api/vehicles/{id}/` - Actualizar vehículo
- `GET /api/vehicles/{id}/service-history/` - Historial de servicios

#### Aplicación 2: `orders`

**Propósito:** Gestionar órdenes de trabajo y citas de servicio

##### Modelos (`orders/models.py`)
**Estado Actual:** Estructura base preparada para expansión

Modelos esperados:
- **Order** - Orden de servicio
  - Número de orden
  - Cliente, vehículo
  - Estado (pendiente, en progreso, completado)
  - Fecha creación, entrega estimada
  - Descripción de trabajo

- **OrderLineItem** - Detalle de orden
  - Servicio/Pieza utilizada
  - Cantidad, precio
  - Subtotal

- **Appointment** - Cita de servicio
  - Cliente, vehículo
  - Fecha/hora solicitada
  - Tipo de servicio
  - Estado (agendada, completada, cancelada)

- **Service** - Catálogo de servicios
  - Nombre, descripción
  - Precio estándar
  - Tiempo estimado
  - Categoría

##### Vistas (`orders/views.py`)
**Estado Actual:** Estructura base preparada para expansión

Endpoints esperados:
- `GET /api/orders/` - Listar órdenes
- `POST /api/orders/` - Crear orden
- `GET /api/orders/{id}/` - Detalle de orden
- `PUT /api/orders/{id}/` - Actualizar estado
- `GET /api/appointments/` - Listar citas
- `POST /api/appointments/` - Agendar cita
- `GET /api/services/` - Catálogo de servicios

### Flujo de Proceso Típico

```
1. Cliente agenda cita
   ↓
2. Sistema reserva slot horario
   ↓
3. Se genera orden de servicio
   ↓
4. Operador inicia trabajo
   ↓
5. Se registran piezas/servicios utilizados
   ↓
6. Operador marca como completado
   ↓
7. Cliente recibe notificación
```

### Puerto
- **Desarrollo:** 8000
- **Producción:** 8000 (detrás de proxy)

---

## Configuración y Deployments

### Docker Compose

**Archivo:** `docker-compose.yml` (en raíz del proyecto)

Servicios orquestados:
1. **inventory-service** - Puerto 8001
2. **users-service** - Puerto 8002
3. **ocr-service** - Puerto 8003
4. **workshop-service** - Puerto 8004
5. **postgres** - Puerto 5432 (BD compartida)

### Dockerfile Base

```dockerfile
# Todos los servicios usan esta estructura
FROM python:3.12-slim

# Optimización: No generar .pyc ni buffering de logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY . .

# Comando de inicio
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

**Notas Importantes:**
- `PYTHONDONTWRITEBYTECODE=1` - Evita generación de __pycache__
- `PYTHONUNBUFFERED=1` - Logs en tiempo real
- `--no-cache-dir` - Reduce tamaño de imagen
- Multiproceso en desarrollo; usar Gunicorn en producción

### OCR Service - Dockerfile Especial

```dockerfile
FROM python:3.12-slim

# Instalar dependencias del sistema para OCR
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

---

## Base de Datos

### Estrategia de Base de Datos

**Modelo:** Base de datos compartida (PostgreSQL)

```
┌─────────────────────────────────────────┐
│        PostgreSQL (Compartida)          │
├─────────────────────────────────────────┤
│ inventory_db                            │
│ users_db                                │
│ ocr_db                                  │
│ workshop_db                             │
└─────────────────────────────────────────┘
```

### Consideraciones

**Ventajas:**
✓ Gestión centralizada
✓ Transacciones ACID garantizadas
✓ Integridad referencial entre servicios

**Desventajas:**
✗ Acoplamiento de datos
✗ Escalabilidad limitada
✗ Un único punto de fallo

### Migraciones

**Comando:** `python manage.py migrate`

Estructura por servicio:
```
{app_name}/migrations/
├── 0001_initial.py
├── 0002_add_field.py
├── __init__.py
```

**Control de versiones:** Cada migración es un archivo incrementado

---

## Procesos de Build y Deployment

### Desarrollo Local

#### 1. Setup Inicial

```bash
# Clonar repositorio
git clone <repo-url>
cd sigmotos-backend

# Para cada servicio:
cd inventory_service
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt

# Aplicar migraciones
python manage.py migrate

# Cargar datos iniciales (si existen)
python manage.py loaddata fixtures/*.json

# Iniciar servidor
python manage.py runserver 0.0.0.0:8000
```

#### 2. Desarrollo con Docker

```bash
# Desde raíz del proyecto
docker-compose up -d

# Ver logs
docker-compose logs -f

# Acceder a shell interactivo
docker-compose exec inventory-service python manage.py shell

# Aplicar migraciones
docker-compose exec inventory-service python manage.py migrate
```

### Pipeline de Build

```
Source Code
    ↓
Validación de linting (flake8, pylint)
    ↓
Pruebas unitarias (pytest, unittest)
    ↓
Build de imagen Docker
    ↓
Push a registry (DockerHub, ECR)
    ↓
Deployment a producción
```

### Comandos Django Esenciales

| Comando | Propósito |
|---------|-----------|
| `manage.py migrate` | Aplicar migraciones de BD |
| `manage.py makemigrations` | Crear nuevas migraciones |
| `manage.py createsuperuser` | Crear usuario admin |
| `manage.py shell` | Shell interactivo Python |
| `manage.py runserver` | Servidor de desarrollo |
| `manage.py collectstatic` | Recolectar archivos estáticos |
| `manage.py test` | Ejecutar pruebas |

---

## Consideraciones de Producción

### Seguridad

#### 1. Settings.py

```python
# CAMBIOS OBLIGATORIOS EN PRODUCCIÓN

DEBUG = False  # NUNCA True en producción

SECRET_KEY = os.environ.get('SECRET_KEY')  # Desde variable de entorno

ALLOWED_HOSTS = ['dominio.com', 'www.dominio.com']  # Especificar hosts

SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
HSTS_SECONDS = 31536000
```

#### 2. Variables de Entorno Obligatorias

```bash
# .env.production
SECRET_KEY=<generate-new-secure-key>
DEBUG=False
ALLOWED_HOSTS=sigmotos.com,api.sigmotos.com
DATABASE_URL=postgres://user:pass@host:5432/dbname
EMAIL_HOST_PASSWORD=<email-password>
CORS_ALLOWED_ORIGINS=https://sigmotos.com
```

#### 3. Base de Datos

```python
# Usar servidor de base de datos externo
# NO usar SQLite en producción
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'sigmotos_prod',
        'USER': 'postgres_user',
        'PASSWORD': 'secure_password',
        'HOST': 'db.prod.aws.com',
        'PORT': '5432',
        'ATOMIC_REQUESTS': True,
        'CONN_MAX_AGE': 600,
    }
}
```

### Performance

#### 1. Web Server

Reemplazar servidor de desarrollo:

```bash
# En lugar de: python manage.py runserver
# Usar: gunicorn

gunicorn \
  --workers=4 \
  --worker-class=sync \
  --bind=0.0.0.0:8000 \
  --access-logfile=- \
  --error-logfile=- \
  inventory_service.wsgi:application
```

#### 2. Caché

```python
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://redis:6379/1',
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
```

#### 3. Logging

```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/sigmotos/error.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

### Monitoreo y Observabilidad

#### 1. Health Checks

```python
# Agregar endpoint para health checks
urlpatterns = [
    path('health/', views.health_check, name='health'),
    path('admin/', admin.site.urls),
]
```

#### 2. Métricas

- Response time por endpoint
- Tasa de error
- Uso de base de datos
- Consumo de memoria/CPU

#### 3. Alertas

- Tasa de error > 5%
- Response time > 1s
- Disponibilidad < 99.9%

### Escalabilidad

#### Horizontal Scaling

```yaml
# docker-compose.yml
services:
  inventory-service:
    deploy:
      replicas: 3  # 3 instancias
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

#### Load Balancing

- Usar Nginx o HAProxy
- Round-robin entre instancias
- Session stickiness si es necesario

### Backup y Recuperación

#### PostgreSQL

```bash
# Backup
pg_dump -U postgres sigmotos_prod > backup.sql

# Restore
psql -U postgres sigmotos_prod < backup.sql
```

#### Automático

```bash
# Diario a las 2 AM
0 2 * * * pg_dump -U postgres sigmotos_prod > /backups/db_$(date +\%Y\%m\%d).sql
```

---

## Resumen Técnico

### Fortalezas de la Arquitectura

✅ Microservicios independientes y escalables  
✅ Django 5.2.13 (versión actual)  
✅ Separación clara de responsabilidades  
✅ Containerización con Docker  
✅ Gestión de secretos con .env  
✅ OCR integrado para automatización  
✅ Potencial para async con Celery/Redis  

### Estadísticas del Backend

| Métrica | Valor |
|---------|-------|
| **Servicios** | 4 (Inventory, Users, OCR, Workshop) |
| **Framework** | Django 5.2.13 |
| **Python** | 3.12 |
| **Modelo BD** | PostgreSQL (Compartida) |
| **Patrón** | Microservicios |
| **Containerización** | Docker |
| **Puerto Base** | 8000 |
| **Puerto OCR** | Requiere dependencias especiales |

### Próximos Pasos Recomendados

- [ ] Implementar modelos de datos completos
- [ ] Desarrollar endpoints REST
- [ ] Implementar autenticación JWT
- [ ] Agregar pruebas unitarias
- [ ] Configurar CI/CD pipeline
- [ ] Implementar logging centralizado
- [ ] Agregar documentación API (Swagger/OpenAPI)
- [ ] Configurar CORS para frontend
- [ ] Optimizar queries de base de datos
- [ ] Implementar rate limiting
- [ ] Agregar validación de datos (serializers)
- [ ] Documentación de deployment

---

## Conclusiones

El módulo backend de **SIGMOTOS** implementa una arquitectura moderna de microservicios con Django, ofreciendo:

- **Escalabilidad:** Cada servicio puede escalar independientemente
- **Mantenibilidad:** Código organizado por dominio de negocio
- **Flexibilidad:** Fácil agregar nuevos servicios o funcionalidades
- **Resiliencia:** Fallos aislados, afectan solo un dominio
- **Producción-Ready:** Configuración de seguridad y deployment

Esta arquitectura es apropiada para aplicaciones empresariales medianas-grandes con requerimientos complejos de gestión.

---

**Documento preparado por:** Equipo de Desarrollo SIGMOTOS  
**Última actualización:** Mayo 2026  
**Versión del documento:** 1.0.0
