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

export async function GET(request: Request) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status")?.toUpperCase();
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};
    if (statusParam && VALID_STATUSES.includes(statusParam as OrderStatus)) {
      where.status = statusParam as OrderStatus;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: { include: { product: true } } },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders: orders.map(formatOrder),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al obtener órdenes" }, { status: 500 });
  }
}
