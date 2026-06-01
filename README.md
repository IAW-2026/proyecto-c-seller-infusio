# Seller App — Infusio

**Deploy:** https://proyecto-c-seller-infusio.vercel.app

## Usuarios de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Vendedor | seller+clerktest@iaw.com | iawuser# |
| Administrador | selleradmin+clerktest@iaw.com | iawuser# |

También se puede iniciar sesión con Google. Cualquier cuenta de Google queda registrada como vendedor.

## Instrucciones de uso

- Ingresar con el usuario **vendedor** para acceder al panel de gestión: productos, órdenes y perfil del negocio.
- Ingresar con el usuario **administrador** para acceder al panel de admin, donde se pueden gestionar los vendedores registrados.
- La base de datos ya cuenta con productos y órdenes precargados para facilitar la evaluación.

## Descripción

Panel de gestión para vendedores del marketplace de infusiones y tés. Permite administrar el catálogo de productos (crear, editar, publicar/despublicar), visualizar y gestionar órdenes recibidas, y mantener el perfil del negocio.

Incluye un panel de administración separado para gestionar los vendedores registrados en la plataforma.

**Stack:** Next.js 15 · Tailwind CSS v4 · Prisma · PostgreSQL (Neon) · Clerk · Cloudinary

## Notas para la corrección

- La autenticación está manejada con Clerk. Los roles (vendedor / admin) se asignan mediante `publicMetadata` en el usuario de Clerk.
- Las imágenes de productos se suben a Cloudinary mediante un widget integrado en el formulario.
- La documentación detallada de cada funcionalidad está en la carpeta [`/docs`](./docs):
  - [Dashboard](./docs/dashboard.md) · [Productos](./docs/productos.md) · [Órdenes](./docs/ordenes.md) · [Perfil del vendedor](./docs/perfil.md) · [Panel de administración](./docs/admin.md) · [API REST](./docs/api.md) · [APIs externas](./docs/apis-externas.md) · [Autenticación y roles](./docs/autenticacion.md) · [Errores y validaciones](./docs/errores-y-validaciones.md)

