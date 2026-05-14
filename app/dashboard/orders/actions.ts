"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, newStatus: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus as never },
  });

  revalidatePath("/dashboard/orders");
}

export async function createShipment(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return;

  const seller = await prisma.seller.findFirst();

  const { shipping_id } = await callShipping({
    orderId,
    buyerId: order.buyerId,
    originAddress: seller?.address ?? "Dirección del vendedor",
    originPostalCode: seller?.postalCode ?? "0000",
    destinationAddress: order.destinationAddress ?? "Dirección del comprador",
    destinationPostalCode: order.destinationPostalCode ?? "0000",
  });

  await prisma.order.update({
    where: { id: orderId },
    data: { shippingId: shipping_id },
  });

  revalidatePath("/dashboard/orders");
}

async function callShipping(params: {
  orderId: string;
  buyerId: string;
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      order_id: params.orderId,
      buyer_id: params.buyerId,
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
