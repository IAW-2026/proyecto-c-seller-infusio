# Validación de formularios del lado del servidor

La validación del lado del servidor garantiza que los datos que llegan a la API sean correctos **antes** de guardarlos en la base de datos, sin importar lo que envíe el cliente.

## ¿Por qué en el servidor?

La validación del cliente (HTML `required`, lógica en React) se puede saltear fácilmente desde herramientas como Postman o el devtools del navegador. El servidor es el único punto donde se puede confiar en que la validación siempre se ejecuta.

## Herramienta: Zod

Se usa [Zod](https://zod.dev) para definir la "forma" esperada de cada request. Un schema describe qué campos se esperan, de qué tipo y con qué reglas.

```ts
// lib/schemas.ts
export const productCreateSchema = z.object({
  name:  z.string().min(1, "El nombre es requerido").max(100),
  price: z.number().positive("El precio debe ser mayor a 0"),
  stock: z.number().int().nonnegative("El stock no puede ser negativo"),
  description: z.string().max(500).optional(),
  category:    z.string().max(50).optional(),
  imageUrl:    z.string().optional(),
});
```

## Flujo en cada endpoint

1. El endpoint recibe el body del request.
2. Se llama a `safeParse()` — si los datos no cumplen el schema, devuelve los errores **sin lanzar una excepción**.
3. Si hay errores, se responde con `400` y el mensaje descriptivo.
4. Si todo está bien, `result.data` contiene los datos ya tipados y validados, listos para pasar a Prisma.

```ts
// app/api/seller/products/route.ts
const result = productCreateSchema.safeParse(body);

if (!result.success) {
  const errors = result.error.issues.map((i) => i.message).join(", ");
  return NextResponse.json({ error: errors }, { status: 400 });
}

// result.data está garantizado: correcto tipo, campos válidos
const { name, price, stock, ...rest } = result.data;
```

## Schemas disponibles

Todos los schemas están centralizados en `lib/schemas.ts`:

| Schema | Usado en |
|--------|----------|
| `productCreateSchema` | `POST /api/seller/products` |
| `productUpdateSchema` | `PATCH /api/seller/products/[id]` |
| `sellerProfileSchema` | `PATCH /api/seller/profile` |
| `adminSellerCreateSchema` | `POST /api/admin/sellers` |
| `adminSellerUpdateSchema` | `PUT /api/admin/sellers/[id]` |
| `orderStatusSchema` | server action `updateOrderStatus` |

## Caso especial: edición de productos

El schema de edición usa `.partial()` (todos los campos opcionales, para soportar actualizaciones parciales) y `.strict()` (rechaza cualquier campo no declarado en el schema).

Esto evita que alguien envíe un campo como `sellerId` para intentar reasignar un producto a otro vendedor — el endpoint responde con `400` sin llegar a ejecutar el query.

```ts
export const productUpdateSchema = z.object({
  name: z.string().min(1).max(100),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  // ...
}).partial().strict();
```
