import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { productCreateSchema } from "@/lib/schemas";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      ...(search && {
        name: { contains: search, mode: "insensitive" as const },
      }),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const seller = await prisma.seller.findUnique({ where: { clerkId: userId } });
    if (!seller) {
      return NextResponse.json(
        { error: "Completá tu perfil de vendedor antes de crear productos" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const result = productCreateSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.issues.map((i) => i.message).join(", ");
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { name, description, price, stock, imageUrl, categories } = result.data;
    const product = await prisma.product.create({
      data: { sellerId: seller.id, name, description, price, stock, imageUrl, categories },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}