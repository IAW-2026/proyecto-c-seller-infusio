import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shopping_cart_id, user_id, destination_address } = body;

    if (!shopping_cart_id || !user_id || !destination_address) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: shopping_cart_id, user_id, destination_address" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        buyerId: user_id,
        shoppingCartId: shopping_cart_id,
        totalAmount: 0,
        status: "PENDING",
        destinationAddress: destination_address.address,
        destinationPostalCode: destination_address.postal_code,
      },
    });

    const seller = await prisma.seller.findFirst();

    // Etapa 3: reemplazar 0 por la suma real de los productos del carrito
    const productTotal = 0;

    const { shipping_cost } = await getShippingCost({
      originPostalCode: seller?.postalCode ?? "0000",
      destinationPostalCode: destination_address.postal_code,
    });

    const totalAmount = productTotal + shipping_cost;

    const { payment_order_id, checkout_url } = await callPayments({
      orderId: order.id,
      buyerId: user_id,
      amount: totalAmount,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { totalAmount, paymentOrderId: payment_order_id, checkoutUrl: checkout_url },
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
