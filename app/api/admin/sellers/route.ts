import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkAdminApi } from "@/lib/admin";
import { adminSellerCreateSchema } from "@/lib/schemas";

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
  const result = adminSellerCreateSchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.issues.map((i) => i.message).join(", ");
    return NextResponse.json({ error: errors }, { status: 400 });
  }

  const { clerkId, name, address, postalCode } = result.data;
  const seller = await prisma.seller.create({
    data: { clerkId, name, address, postalCode },
  });

  return NextResponse.json(seller, { status: 201 });
}
