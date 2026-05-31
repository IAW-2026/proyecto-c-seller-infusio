# Seller App — Infusio

Panel de gestión para vendedores del marketplace de infusiones y tés. Permite administrar productos, visualizar y gestionar órdenes, y mantener el perfil del negocio. Incluye panel de administración para gestionar vendedores registrados.

**Deploy:** https://proyecto-c-seller-infusio.vercel.app

## Stack

Next.js 15 · Tailwind CSS v4 · Prisma · PostgreSQL (Neon) · Clerk · Cloudinary

## Credenciales de acceso

| Rol | Email | Contraseña |
|-----|-------|------------|
| Vendedor | vendedor@infusio.com | Infusio2024! |
| Administrador | seller_admin@infusio.com | #Infusio!!2026 |

También se puede iniciar sesión con Google. Cualquier cuenta de Google queda registrada como vendedor.

## Documentación

Ver la carpeta [`/docs`](./docs) para documentación detallada de cada funcionalidad:

- [Productos](./docs/productos.md)
- [Órdenes](./docs/ordenes.md)
- [Perfil del vendedor](./docs/perfil.md)
- [Panel de administración](./docs/admin.md)
- [API REST](./docs/api.md)
- [Autenticación y roles](./docs/autenticacion.md)

## Variables de entorno

Ver `.env.example` para la lista completa de variables necesarias.
