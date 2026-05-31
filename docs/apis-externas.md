# APIs externas

La app integra tres servicios externos. En todos los casos existe un fallback con datos mockeados para cuando la variable de entorno no está configurada, lo que permite desarrollar sin depender de los otros servicios.

---

## Cloudinary — subida de imágenes

**Cuándo se usa:** al crear o editar un producto, si se sube una imagen.

**Cómo funciona:** se usa el widget de `next-cloudinary` (`CldUploadWidget`) que abre un uploader directo desde el navegador. La imagen se sube a Cloudinary sin pasar por el servidor propio. Una vez subida, Cloudinary devuelve una `secure_url` que se guarda en el campo `imageUrl` del producto en la base de datos.

**Variable de entorno:** `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

**Fallback:** si no se configura la variable, el widget no carga pero el formulario sigue funcionando sin imagen.

---

## Shipping App — costo y registro de envío

**Cuándo se usa:** en dos momentos distintos del flujo de una orden.

### 1. Calcular costo de envío
Se llama al crear una orden de compra (`POST /api/seller/purchase_order`). Consulta el precio de envío según los códigos postales de origen (vendedor) y destino (comprador).

- **Endpoint:** `POST {SHIPPING_API_URL}/api/shipping/cost`
- **Body:** `{ origin_postal_code, destination_postal_code }`
- **Respuesta esperada:** `{ shipping_cost, currency }`
- **Fallback:** devuelve `$1500` fijo si `SHIPPING_API_URL` no está definida.

### 2. Registrar despacho
Se llama cuando el vendedor hace click en "Crear envío" desde el listado de órdenes. Crea el registro logístico en la Shipping App y devuelve un `shippingId`.

- **Endpoint:** `POST {SHIPPING_API_URL}/api/shipping`
- **Body:** `{ order_id, buyer_id, origin_address, destination_address }`
- **Respuesta esperada:** `{ shipping_id }`
- **Fallback:** genera un ID mockeado (`mock_shipping_{orderId}`) si `SHIPPING_API_URL` no está definida.

**Variable de entorno:** `SHIPPING_API_URL`

---

## Payments App — generación de orden de pago

**Cuándo se usa:** al crear una orden de compra, inmediatamente después de calcular el total.

**Cómo funciona:** se envía el monto total a la Payments App, que devuelve un `payment_order_id` y una `checkout_url` que se le entrega al comprador para completar el pago.

- **Endpoint:** `POST {PAYMENTS_API_URL}/api/payments/charge`
- **Body:** `{ seller_app_id, seller_app_order_id, buyer_app_id, buyer_id, amount }`
- **Respuesta esperada:** `{ payment_order_id, checkout_url }`
- **Fallback:** genera un ID y URL mockeados si `PAYMENTS_API_URL` no está definida.

**Variable de entorno:** `PAYMENTS_API_URL`
