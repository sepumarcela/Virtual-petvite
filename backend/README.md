# Petvite Backend — Spring Boot

Backend REST para Virtual Petvite. Construido con Spring Boot 3, Spring Security (JWT), JPA/Hibernate y MySQL.

---

## Requisitos

- Java 17+
- Maven 3.8+
- MySQL 8+

---

## Configuración rápida

### 1. Crea la base de datos en MySQL

```sql
CREATE DATABASE virtualpet_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Configura el archivo `.env`

Copia `.env` (ya incluido) y edita los valores:

```env
# Base de datos · Neon PostgreSQL
# 👉 Copia estos datos desde: neon.tech → tu proyecto → Connection Details → JDBC
DB_URL=jdbc:postgresql://ep-still-sun-amfbmozx-pooler.c-5.us-east-1.aws.neon.tech/neondb
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_2MqSdTfA8cme

JWT_SECRET=un_secreto_largo_y_seguro_de_al_menos_64_caracteres
JWT_EXPIRATION_MS=86400000

ADMIN_EMAIL=admin@virtualpet.co
ADMIN_PASSWORD=admin123

SERVER_PORT=8080
UPLOAD_DIR=uploads/productos
```

### 3. Ejecutar

```bash
./mvnw spring-boot:run
```

El servidor arranca en `http://localhost:8080`.

Al primer inicio se crea automáticamente el usuario admin con las credenciales del `.env`.

---

## Endpoints

### Auth (público)
| Método | URL | Descripción |
|--------|-----|-------------|
| POST | `/api/admin/auth/login` | Login admin → devuelve JWT |
| GET  | `/api/admin/auth/me`    | Info del admin autenticado |

### Productos (público)
| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/productos/dto` | Lista todos los activos (`?categoria=alimentos`) |
| GET | `/productos/{id}` | Detalle por ID |
| GET | `/productos/categorias` | Lista de categorías |

### Pedidos (público)
| Método | URL | Descripción |
|--------|-----|-------------|
| GET  | `/pedidos`     | Lista todos |
| GET  | `/pedidos/{id}` | Por ID |
| POST | `/pedidos`     | Crear nuevo pedido |

### Admin — Productos (requiere JWT)
| Método | URL | Descripción |
|--------|-----|-------------|
| GET    | `/api/admin/productos`              | Paginado |
| GET    | `/api/admin/productos/{id}`          | Por ID |
| POST   | `/api/admin/productos`              | Crear |
| PUT    | `/api/admin/productos/{id}`          | Actualizar |
| DELETE | `/api/admin/productos/{id}`          | Eliminar |
| PATCH  | `/api/admin/productos/{id}/toggle`   | Activar/Desactivar |
| PATCH  | `/api/admin/productos/{id}/precio`   | Cambiar precio |
| PATCH  | `/api/admin/productos/{id}/stock`    | Cambiar stock |

### Admin — Pedidos (requiere JWT)
| Método | URL | Descripción |
|--------|-----|-------------|
| GET   | `/api/admin/pedidos`               | Paginado |
| PATCH | `/api/admin/pedidos/{id}/estado`   | Cambiar estado |

### Admin — Clientes (requiere JWT)
| Método | URL | Descripción |
|--------|-----|-------------|
| GET   | `/api/admin/clientes`              | Paginado |
| GET   | `/api/admin/clientes/{id}`         | Por ID |
| PATCH | `/api/admin/clientes/{id}/toggle`  | Activar/Desactivar |

### Admin — Importación (requiere JWT)
| Método | URL | Descripción |
|--------|-----|-------------|
| POST | `/api/admin/importar/productos` | Excel (.xlsx) |
| POST | `/api/admin/importar/imagenes`  | Imágenes de productos |

---

## Conectar el frontend

En el proyecto `Virtual-petvite`, el archivo `.env` debe apuntar al backend:

```env
VITE_API_URL=http://localhost:8080
```

---

## Excel de importación

El archivo `.xlsx` debe tener estas columnas en orden:

| Col | Campo |
|-----|-------|
| A | Referencia |
| B | Nombre |
| C | Marca |
| D | Categoría |
| E | Descripción |
| F | Precio |
| G | Stock |
| H | Especie |
| I | Presentaciones |
