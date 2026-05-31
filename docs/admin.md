# Panel de administración

Accesible en `/admin/sellers`. Solo disponible para usuarios con el rol `adminSeller` en Clerk.

## Funcionalidades

- **Listado de vendedores** con nombre, dirección y código postal.
- **Búsqueda** por nombre (parámetro `search` en la URL).
- **Paginación** de 10 vendedores por página.
- **Crear vendedor** — formulario en `/admin/sellers/new`.
- **Editar vendedor** — formulario en `/admin/sellers/[id]/edit`.
- **Eliminar vendedor** — baja definitiva con confirmación.

## Acceso

El administrador inicia sesión con sus credenciales y es redirigido automáticamente a `/admin/sellers`. Un usuario sin el rol `adminSeller` que intente acceder a cualquier ruta `/admin/*` es redirigido al dashboard de vendedor.

## API

`GET /api/admin/sellers` — lista todos los vendedores (requiere rol admin).  
`POST /api/admin/sellers` — crea un vendedor.  
`GET /api/admin/sellers/:id` — detalle de un vendedor.  
`PATCH /api/admin/sellers/:id` — edita un vendedor.  
`DELETE /api/admin/sellers/:id` — elimina un vendedor.
