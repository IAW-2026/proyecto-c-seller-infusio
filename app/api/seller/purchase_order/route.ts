import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shopping_cart_id, user_id } = body;

    if (!shopping_cart_id || !user_id) {
      return NextResponse.json(
        { error: "Faltan campos requeridos: shopping_cart_id, user_id" },
        { status: 400 }
      );
    }

    const order = await prisma.order.create({
      data: {
        buyerId: user_id,
        shoppingCartId: shopping_cart_id,
        totalAmount: 0, //Etapa 2, todavía no se ha calculado el total porque no tengo el carrito.
        status: "PENDING",
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