import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  product_name: string;
  product_variant: string;
  product_image_url: string;
  price_at_time: number;
  quantity: number;
}

interface Address {
  street: string;
  city: string;
  province: string;
  postal_code: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shopping_cart_id, user_id, cart_items, address } = body;

    if (!shopping_cart_id || !user_id || !cart_items || !address) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: shopping_cart_id, user_id, cart_items, address" },
        { status: 400 }
      );
    }

    if (!Array.isArray(cart_items) || cart_items.length === 0) {
      return NextResponse.json(
        { error: "cart_items debe ser un array no vacío" },
        { status: 400 }
      );
    }

    const destinationAddress = `${address.street}, ${address.city}, ${address.province}`;
    const destinationPostalCode = (address as Address).postal_code;

    // Buscar a qué seller pertenece cada producto
    const productIds = cart_items.map((item: CartItem) => item.product_id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, sellerId: true },
    });

    const productSellerMap = new Map(products.map((p) => [p.id, p.sellerId]));

    // Agrupar ítems por seller
    const itemsBySeller = new Map<string, CartItem[]>();
    for (const item of cart_items as CartItem[]) {
      const sellerId = productSellerMap.get(item.product_id);
      if (!sellerId) {
        return NextResponse.json(
          { error: `Producto ${item.product_id} no encontrado o sin vendedor asignado` },
          { status: 400 }
        );
      }
      if (!itemsBySeller.has(sellerId)) itemsBySeller.set(sellerId, []);
      itemsBySeller.get(sellerId)!.push(item);
    }

    const purchaseOrders: { purchase_order_id: string; seller_id: string }[] = [];

    // Crear una orden por seller
    for (const [sellerId, sellerItems] of itemsBySeller) {
      const productTotal = sellerItems.reduce(
        (sum, item) => sum + item.price_at_time * item.quantity,
        0
      );

      const seller = await prisma.seller.findUnique({ where: { id: sellerId } });

      const { shipping_cost } = await getShippingCost({
        originPostalCode: seller?.postalCode ?? "0000",
        destinationPostalCode,
      });

      const totalAmount = productTotal + shipping_cost;

      const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
          data: {
            buyerId: user_id,
            sellerId,
            shoppingCartId: shopping_cart_id,
            totalAmount,
            status: "PENDING",
            destinationAddress,
            destinationPostalCode,
          },
        });

        await tx.orderItem.createMany({
          data: sellerItems.map((item) => ({
            orderId: newOrder.id,
            productId: item.product_id,
            quantity: item.quantity,
            unitPrice: item.price_at_time,
          })),
        });

        return newOrder;
      });

      const { payment_order_id, checkout_url } = await callPayments({
        orderId: order.id,
        buyerId: user_id,
        amount: totalAmount,
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { paymentOrderId: payment_order_id, checkoutUrl: checkout_url },
      });

      purchaseOrders.push({ purchase_order_id: order.id, seller_id: sellerId });
    }

    return NextResponse.json({ purchase_orders: purchaseOrders }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear orden de compra" },
      { status: 500 }
    );
  }
}

async function getShippingCost({
  originPostalCode,
  destinationPostalCode,
}: {
  originPostalCode: string;
  destinationPostalCode: string;
}) {
  const shippingUrl = process.env.SHIPPING_API_URL;

  if (!shippingUrl) {
    return { shipping_cost: 1500, currency: "ARS" };
  }

  const res = await fetch(`${shippingUrl}/api/shipping/cost`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      origin_postal_code: originPostalCode,
      destination_postal_code: destinationPostalCode,
      volume: 1,
    }),
  });

  return res.json();
}

async function callPayments({
  orderId,
  buyerId,
  amount,
}: {
  orderId: string;
  buyerId: string;
  amount: number;
}) {
  const paymentsUrl = process.env.PAYMENTS_API_URL;

  if (!paymentsUrl) {
    return {
      payment_order_id: `mock_payment_${orderId}`,
      checkout_url: `https://mock-checkout.com/${orderId}`,
    };
  }

  const res = await fetch(`${paymentsUrl}/api/payments/charge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      seller_app_id: process.env.SELLER_APP_ID ?? "seller-infusio",
      seller_app_order_id: orderId,
      buyer_app_id: "buyer-app",
      buyer_id: buyerId,
      amount,
    }),
  });

  return res.json();
}
