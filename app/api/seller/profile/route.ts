import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const seller = await prisma.seller.findUnique({
    where: { clerkId: userId },
  });

  return NextResponse.json(seller);
}

export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { name, address, postalCode } = body;

  if (!name || !address || !postalCode) {
    return NextResponse.json(
      { error: "Faltan campos requeridos: nombre, dirección y código postal" },
      { status: 400 }
    );
  }

  const seller = await prisma.seller.upsert({
    where: { clerkId: userId },
    update: { name, address, postalCode },
    create: { clerkId: userId, name, address, postalCode },
  });

  return NextResponse.json(seller);
}
