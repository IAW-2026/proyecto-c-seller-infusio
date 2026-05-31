# Perfil del vendedor

El vendedor configura su perfil desde `/dashboard/profile`.

## Campos

| Campo | Descripción |
|-------|-------------|
| Nombre del negocio | Nombre visible del vendedor |
| Dirección de despacho | Dirección desde donde se envían los productos |
| Código postal | Código postal de origen para calcular costos de envío |

## Importancia del código postal

El código postal se usa al crear una orden de compra: la app consulta a la Shipping App el costo de envío entre el código postal del vendedor y el del comprador. Si no está configurado, se usa `"0000"` como fallback.

## API

`GET /api/seller/profile` — devuelve el perfil del vendedor autenticado.  
`PATCH /api/seller/profile` — actualiza nombre, dirección y código postal.
