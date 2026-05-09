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

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar notificación de pago" },
      { status: 500 }
    );
  }
}