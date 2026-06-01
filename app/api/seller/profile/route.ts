import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sellerProfileSchema } from "@/lib/schemas";

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
  const result = sellerProfileSchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.issues.map((i) => i.message).join(", ");
    return NextResponse.json({ error: errors }, { status: 400 });
  }

  const { name, address, postalCode } = result.data;
  const seller = await prisma.seller.upsert({
    where: { clerkId: userId },
    update: { name, address, postalCode },
    create: { clerkId: userId, name, address, postalCode },
  });

  return NextResponse.json(seller);
}
