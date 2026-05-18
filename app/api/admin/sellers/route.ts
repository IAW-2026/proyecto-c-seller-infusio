import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkAdminApi } from "@/lib/admin";

export async function GET() {
  const admin = await checkAdminApi();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const sellers = await prisma.seller.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(sellers);
}

export async function POST(request: Request) {
  const admin = await checkAdminApi();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await request.json();
  const { clerkId, name, address, postalCode } = body;

  if (!clerkId || !name || !address || !postalCode) {
    return NextResponse.json(
      { error: "Faltan campos requeridos: clerkId, name, address, postalCode" },
      { status: 400 }
    );
  }

  const seller = await prisma.seller.create({
    data: { clerkId, name, address, postalCode },
  });

  return NextResponse.json(seller, { status: 201 });
}
