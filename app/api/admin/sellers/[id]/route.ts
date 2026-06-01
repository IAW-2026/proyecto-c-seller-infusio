import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkAdminApi } from "@/lib/admin";
import { adminSellerUpdateSchema } from "@/lib/schemas";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await checkAdminApi();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const body = await request.json();
  const result = adminSellerUpdateSchema.safeParse(body);
  if (!result.success) {
    const errors = result.error.issues.map((i) => i.message).join(", ");
    return NextResponse.json({ error: errors }, { status: 400 });
  }

  const { name, address, postalCode } = result.data;
  const seller = await prisma.seller.update({
    where: { id },
    data: { name, address, postalCode },
  });

  return NextResponse.json(seller);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await checkAdminApi();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  await prisma.seller.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
