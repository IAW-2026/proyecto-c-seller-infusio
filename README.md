# Seller App — Infusio

Panel de gestión para vendedores del marketplace de infusiones y tés. Permite administrar productos, visualizar y gestionar órdenes, y mantener el perfil del negocio. Incluye panel de administración para gestionar vendedores registrados.

**Deploy:** https://proyecto-c-seller-infusio.vercel.app

## Stack

Next.js 15 · Tailwind CSS v4 · Prisma · PostgreSQL (Neon) · Clerk · Cloudinary

## Acceso

### Vendedor

Ir al link de deploy e iniciar sesión con Google o email a través de Clerk. Cualquier cuenta puede registrarse como vendedor.

### Administrador

El acceso de administrador requiere un usuario con el rol `adminSeller` configurado en Clerk (`publicMetadata.roles`). Contactar a la desarrolladora para obtener acceso con una cuenta de prueba.

## API REST

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/seller/purchase_order` | Crear orden de compra (multi-seller) |
| `GET` | `/api/seller/purchase_orders` | Listar órdenes del vendedor |
| `GET/PATCH` | `/api/seller/purchase_orders/:id` | Detalle y actualización de orden |
| `POST` | `/api/seller/orders/:id/payment-confirmed` | Confirmar pago de una orden |
| `GET` | `/api/seller/orders/:id/payment-url` | Obtener URL de pago |
| `GET/POST` | `/api/seller/products` | Listar y crear productos |
| `GET/PATCH/DELETE` | `/api/seller/products/:id` | Detalle, editar y eliminar producto |
| `GET/PATCH` | `/api/seller/profile` | Perfil del vendedor |
| `GET/POST` | `/api/admin/sellers` | Gestión de vendedores (admin) |
| `GET/PATCH/DELETE` | `/api/admin/sellers/:id` | Detalle de vendedor (admin) |

## Variables de entorno

Ver `.env.example` para la lista completa de variables necesarias.
