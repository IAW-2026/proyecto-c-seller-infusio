import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateApiKey } from "@/lib/api-auth";
import { OrderStatus, Prisma } from "@prisma/client";

type OrderWithItems = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } } };
}>;

function formatOrder(order: OrderWithItems) {
  return {
    purchase_order_id: order.id,
    user_id: order.buyerId,
    shopping_cart_id: order.shoppingCartId,
    status: order.status.toLowerCase(),
    created_at: order.createdAt,
    shipping_id: order.shippingId,
    payment_id: order.paymentOrderId,
    payment_url: order.checkoutUrl,
    shipping_cost: order.shippingCost ?? 0,
    currency: "ARS",
    address: order.destinationAddress ?? "",
    total: order.totalAmount,
    cart_items: order.items.map((item) => ({
      id: item.id,
      cart_id: order.shoppingCartId,
      product_id: item.productId,
      product_name: item.product.name,
      product_variant: item.productVariant,
      product_image_url: item.product.imageUrl,
      price_at_time: item.unitPrice,
      quantity: item.quantity,
    })),
  };
}

const VALID_STATUSES = Object.values(OrderStatus);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ order: formatOrder(order) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener la orden" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const newStatus = body.status?.toUpperCase();

    if (!newStatus || !VALID_STATUSES.includes(newStatus as OrderStatus)) {
      return NextResponse.json(
        { error: `Estado inválido. Valores permitidos: ${VALID_STATUSES.map((s) => s.toLowerCase()).join(", ")}` },
        { status: 400 }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status: newStatus as OrderStatus },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json({ order: formatOrder(order) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al actualizar la orden" }, { status: 500 });
  }
}
