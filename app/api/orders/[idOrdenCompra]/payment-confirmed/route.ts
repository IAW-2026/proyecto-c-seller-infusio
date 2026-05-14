import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ idOrdenCompra: string }> }
) {
  try {
    const { idOrdenCompra } = await params;
    const body = await request.json();
    const { payment_order_id, status } = body;

    if (!payment_order_id || !status) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: payment_order_id, status" },
        { status: 400 }
      );
    }

    if (!["accepted", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Status inválido. Debe ser 'accepted' o 'cancelled'" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: idOrdenCompra },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    await prisma.order.update({
      where: { id: idOrdenCompra },
      data: {
        status: status === "accepted" ? "PAYMENT_CONFIRMED" : "CANCELLED",
        paymentOrderId: payment_order_id,
      },
    });

    if (status === "accepted") {
      const seller = await prisma.seller.findFirst();

      const { shipping_id } = await callShipping({
        orderId: idOrdenCompra,
        buyerId: order.buyerId,
        originAddress: seller?.address ?? "Dirección del vendedor",
        originPostalCode: seller?.postalCode ?? "0000",
        destinationAddress: order.destinationAddress ?? "Dirección del comprador",
        destinationPostalCode: order.destinationPostalCode ?? "0000",
      });

      await prisma.order.update({
        where: { id: idOrdenCompra },
        data: { shippingId: shipping_id },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar notificación de pago" },
      { status: 500 }
    );
  }
}

async function callShipping(params: {
  orderId: string;
  buyerId: string;
  originAddress: string;
  originPostalCode: string;
  destinationAddress: string;
  destinationPostalCode: string;
}) {
  const shippingUrl = process.env.SHIPPING_API_URL;

  if (!shippingUrl) {
    return { shipping_id: `mock_shipping_${params.orderId}` };
  }

  const res = await fetch(`${shippingUrl}/api/shipping`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order_id: params.orderId,
      buyer_id: params.buyerId,
      origin_address: {
        address: params.originAddress,
        postal_code: params.originPostalCode,
      },
      destination_address: {
        address: params.destinationAddress,
        postal_code: params.destinationPostalCode,
      },
    }),
  });

  return res.json();
}
