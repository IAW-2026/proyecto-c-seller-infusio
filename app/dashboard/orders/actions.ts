"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { orderStatusSchema } from "@/lib/schemas";

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const result = orderStatusSchema.safeParse(newStatus);
  if (!result.success) {
    throw new Error("Estado de orden inválido");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: result.data },
  });

  revalidatePath("/dashboard/orders");
}

export async function dispatchOrder(orderId: string) {
  const { userId } = await auth();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return;

  const seller = userId
    ? await prisma.seller.findUnique({ where: { clerkId: userId } })
    : null;

  const { shipping_id } = await callShipping({
    orderId,
    buyerId: order.buyerId,
    sellerId: seller?.clerkId ?? null,
    originAddress: seller?.address ?? "Dirección del vendedor",
    originPostalCode: seller?.postalCode ?? "0000",
    destinationAddress: order.destinationAddress ?? "Dirección del comprador",
    destinationPostalCode: order.destinationPostalCode ?? "0000",
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { shippingId: shipping_id, status: "DISPATCHED" },
  });

  revalidatePath("/dashboard/orders");
}

async function callShipping(params: {
  orderId: string;
  buyerId: string;
  sellerId: string | null;
  originAddress: string;
  originPostalCode: string;
  destinationAddress: string;
  destinationPostalCode: string;
}) {
  const shippingUrl = process.env.SHIPPING_API_URL;

  if (!shippingUrl) {
    return { shipping_id: `mock_shipping_${params.orderId}` };
  }

  const res = await fetch(`${shippingUrl}/api/shipping`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.SHIPPING_API_KEY ?? ""}`,
    },
    body: JSON.stringify({
      order_id: params.orderId,
      buyer_id: params.buyerId,
      seller_id: params.sellerId,
      origin_address: {
        address: params.originAddress,
        postal_code: params.originPostalCode,
      },
      destination_address: {
        address: params.destinationAddress,
        postal_code: params.destinationPostalCode,
      },
    }),
  });

  return res.json();
}
