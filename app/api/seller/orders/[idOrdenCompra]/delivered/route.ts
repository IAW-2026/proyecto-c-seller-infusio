import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateApiKey } from "@/lib/api-auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ idOrdenCompra: string }> }
) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  try {
    const { idOrdenCompra } = await params;

    const order = await prisma.order.findUnique({
      where: { id: idOrdenCompra },
    });

    if (!order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    if (order.status !== "DISPATCHED") {
      return NextResponse.json(
        { error: "La orden no está en estado DISPATCHED" },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: { id: idOrdenCompra },
      data: { status: "DELIVERED" },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al procesar notificación de entrega" },
      { status: 500 }
    );
  }
}
