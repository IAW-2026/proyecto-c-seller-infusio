import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener la orden de compra" },
      { status: 500 }
    );
  }
}
