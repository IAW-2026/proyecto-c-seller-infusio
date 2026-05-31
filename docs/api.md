# API REST

Todos los endpoints están bajo el dominio de la app. Los marcados como **público** no requieren autenticación y están pensados para ser consumidos por las otras apps del marketplace (Buyer App, Payments App, Shipping App).

## Órdenes de compra

### `POST /api/seller/purchase_order` — público
Crea una orden de compra. Calcula el costo de envío consultando a la Shipping App y genera la orden de pago en la Payments App.

**Body:**
```json
{
  "shopping_cart_id": "string",
  "user_id": "string",
  "cart_items": [
    {
      "product_id": "string",
      "product_name": "string",
      "price_at_time": 1500,
      "quantity": 2
    }
  ],
  "address": {
    "street": "Av. Corrientes 1234",
    "city": "Buenos Aires",
    "province": "CABA",
    "postal_code": "1043"
  }
}
```

**Respuesta:** `201` con `purchase_order_id`, `payment_url`, `shipping_cost`, etc.

### `GET /api/seller/purchase_orders` — público
Lista las órdenes del vendedor autenticado.

### `GET /api/seller/purchase_orders/:id` — público
Detalle de una orden.

### `PATCH /api/seller/purchase_orders/:id` — público
Actualiza el estado de una orden.

---

## Confirmación de pago

### `POST /api/orders/:id/payment-confirmed` — público
Webhook llamado por la Payments App para notificar el resultado del pago.

**Body:**
```json
{
  "payment_order_id": "string",
  "status": "accepted" | "cancelled"
}
```

- Si `status = "accepted"`: cambia el estado de la orden a `PAYMENT_CONFIRMED`, guarda el `payment_order_id` y registra automáticamente el envío en la Shipping App (guarda el `shippingId` resultante).
- Si `status = "cancelled"`: cambia el estado a `CANCELLED`.

**Respuesta:** `200` con `{ ok: true }`.

### `GET /api/seller/orders/:id/payment-url` — público
Devuelve la URL de checkout para que el comprador complete el pago.

---

## Productos

### `GET /api/seller/products` — público
Lista los productos activos. Soporta `?search=` y `?page=`.

### `POST /api/seller/products`
Crea un producto. Requiere autenticación de vendedor.

### `GET /api/seller/products/:id` — público
Detalle de un producto.

### `PATCH /api/seller/products/:id`
Edita un producto. Requiere ser el vendedor dueño del producto.

### `DELETE /api/seller/products/:id`
Baja lógica (`isActive = false`). Requiere ser el vendedor dueño.

---

## Perfil

### `GET /api/seller/profile`
Devuelve el perfil del vendedor autenticado.

### `PATCH /api/seller/profile`
Actualiza nombre, dirección y código postal.

---

## Admin

### `GET /api/admin/sellers`
Lista todos los vendedores registrados. Requiere rol `adminSeller`.

### `POST /api/admin/sellers`
Crea un vendedor manualmente.

### `GET /api/admin/sellers/:id`
Detalle de un vendedor.

### `PATCH /api/admin/sellers/:id`
Edita nombre, dirección o código postal de un vendedor.

### `DELETE /api/admin/sellers/:id`
Elimina un vendedor definitivamente.
