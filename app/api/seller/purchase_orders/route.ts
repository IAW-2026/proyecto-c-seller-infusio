import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        { error: "Falta el parámetro requerido: user_id" },
        { status: 400 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { buyerId: user_id },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      orders: orders.map(formatOrder),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener órdenes de compra" },
      { status: 500 }
    );
  }
}

function formatOrder(order: Awaited<ReturnType<typeof prisma.order.findMany>>[number] & {
  items: Array<{ id: string; productId: string; quantity: number; unitPrice: number; productVariant: string | null; product: { name: string; imageUrl: string | null } }>;
}) {
  return {
    purchase_order_id: order.id,
    user_id: order.buyerId,
    shopping_cart_id: order.shoppingCartId,
    status: order.status.toLowerCase(),
    created_at: order.createdAt,
    shipping_id: order.shippingId,
    payment_id: order.paymentOrderId,
    payment_url: order.checkoutUrl,
    shipping_cost: order.shippingCost,
    currency: "ARS",
    address: order.destinationAddress,
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
