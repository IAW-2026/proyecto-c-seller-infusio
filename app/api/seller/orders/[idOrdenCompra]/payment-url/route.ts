import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ idOrdenCompra: string }> }
) {
  try {
    const { idOrdenCompra } = await params;

    const order = await prisma.order.findUnique({
      where: { id: idOrdenCompra },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    if (!order.paymentOrderId || !order.checkoutUrl) {
      return NextResponse.json(
        { error: "La orden aún no tiene URL de pago generada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      payment_order_id: order.paymentOrderId,
      checkout_url: order.checkoutUrl,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener URL de pago" },
      { status: 500 }
    );
  }
}