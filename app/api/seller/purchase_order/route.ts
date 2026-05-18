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

    const productTotal = cart_items.reduce(
      (sum: number, item: CartItem) => sum + item.price_at_time * item.quantity,
      0
    );

    const destinationAddress = `${address.street}, ${address.city}, ${address.province}`;
    const destinationPostalCode = (address as Address).postal_code;

    const seller = await prisma.seller.findFirst();

    const { shipping_cost } = await getShippingCost({
      originPostalCode: seller?.postalCode ?? "0000",
      destinationPostalCode,
    });

    const totalAmount = productTotal + shipping_cost;

    // Crear orden e ítems en una transacción: si algo falla, se revierte todo
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          buyerId: user_id,
          shoppingCartId: shopping_cart_id,
          totalAmount,
          status: "PENDING",
          destinationAddress,
          destinationPostalCode,
        },
      });

      await tx.orderItem.createMany({
        data: cart_items.map((item: CartItem) => ({
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

    return NextResponse.json({ purchase_order_id: order.id }, { status: 201 });
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
