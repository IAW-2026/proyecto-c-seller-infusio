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

    // Etapa 3: acá iría a buscar el carrito al Buyer App con el shopping_cart_id
    // para obtener los items y calcular el total real
    const totalAmount = 0;

    const order = await prisma.order.create({
      data: {
        buyerId: user_id,
        shoppingCartId: shopping_cart_id,
        totalAmount,
        status: "PENDING",
        destinationAddress: destination_address.address,
        destinationPostalCode: destination_address.postal_code,
      },
    });

    const { payment_order_id, checkout_url } = await callPayments(order.id, user_id, totalAmount);

    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentOrderId: payment_order_id,
        checkoutUrl: checkout_url,
      },
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

async function callPayments(orderId: string, buyerId: string, amount: number) {
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
