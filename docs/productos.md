# Gestión de productos

El vendedor puede crear, editar y dar de baja sus productos desde `/dashboard/products`.

## Listado

![Listado de productos](./images/listado-productos.png)

- Muestra los productos activos del vendedor con imagen, nombre, categoría, precio y stock.
- **Búsqueda** por nombre o categoría en tiempo real (parámetro `search` en la URL).
- **Paginación** de 7 productos por página (parámetro `page` en la URL).
- Badge de stock con colores: verde (>5), amarillo (1–5), rojo (0).

## Crear y editar producto

| | |
|---|---|
| ![Crear nuevo producto](./images/crear-nuevo-producto.png) | ![Editar producto](./images/editar-producto.png) |

Formulario en `/dashboard/products/new` (crear) y `/dashboard/products/[id]` (editar) con los campos:

| Campo | Requerido | Descripción |
|-------|-----------|-------------|
| Nombre | ✅ | Nombre del producto |
| Descripción | — | Texto libre |
| Precio | ✅ | Número decimal |
| Stock | ✅ | Número entero |
| Categoría | — | Texto libre (ej: "Té verde", "Mate") |
| Imagen | — | Subida via Cloudinary |

El formulario de edición incluye además el botón **Eliminar producto** (baja lógica: `isActive = false`).

## Imagen

Las imágenes se suben a [Cloudinary](https://cloudinary.com) usando `next-cloudinary`. La URL resultante se guarda en `imageUrl` del producto. No se almacenan imágenes en la base de datos propia.
