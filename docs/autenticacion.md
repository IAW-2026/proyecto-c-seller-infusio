# Autenticación y roles

La autenticación está manejada por [Clerk](https://clerk.com). Se puede iniciar sesión con Google o con email y contraseña.

## Roles

| Rol | Cómo se asigna | Acceso |
|-----|---------------|--------|
| **Vendedor** | Cualquier cuenta que se registre | `/dashboard` — productos, órdenes, perfil |
| **Admin** | `publicMetadata.roles: ["adminSeller"]` en Clerk | `/admin` — gestión de vendedores |

## Flujo de redirección

Al iniciar sesión, la app detecta el rol del usuario y redirige:
- Admin → `/admin/sellers`
- Vendedor → `/dashboard`

Si un vendedor intenta acceder a `/admin/*`, es redirigido a `/dashboard`. Si un usuario no autenticado intenta acceder a cualquier ruta protegida, es redirigido a `/sign-in`.

## Rutas públicas

Las siguientes rutas no requieren autenticación (están pensadas para ser consumidas por otras apps del marketplace):

- `/api/seller/*`
- `/api/orders/*`
