# Gestión de órdenes

Las órdenes se crean desde la Buyer App y llegan a esta app via la API REST. El vendedor las gestiona desde `/dashboard/orders`.

## Estados y flujo

```
PENDING → PAYMENT_CONFIRMED → PREPARING → DISPATCHED → DELIVERED
                                                      → CANCELLED
```

| Estado | Descripción |
|--------|-------------|
| `PENDING` | Orden creada, esperando pago del comprador |
| `PAYMENT_CONFIRMED` | La Payments App confirmó el pago |
| `PREPARING` | El vendedor está preparando el paquete |
| `DISPATCHED` | El paquete fue entregado al repartidor |
| `DELIVERED` | Entregado al comprador |
| `CANCELLED` | Orden cancelada |

## Acciones del vendedor

Las acciones aparecen según el estado actual de la orden:

| Acción | Disponible cuando | Qué hace |
|--------|-------------------|----------|
| **Crear envío** | `PAYMENT_CONFIRMED` sin `shippingId` | Registra el despacho en la Shipping App y guarda el `shippingId` |
| **Comenzar preparación** | `PAYMENT_CONFIRMED` con `shippingId` | Cambia estado a `PREPARING` |
| **Marcar como despachado** | `PREPARING` | Cambia estado a `DISPATCHED` |

## Costo de envío

El costo se calcula **al momento de crear la orden** (no al despachar). La Buyer App llama a `POST /api/seller/purchase_order`, que consulta el precio a la Shipping App usando los códigos postales de origen y destino. El total ya incluye el envío.

## Listado

- Filtrado por estado via tabs (parámetro `status` en la URL).
- Paginación de 10 órdenes por página.
- Vista adaptada a mobile (cards) y desktop (tabla).
