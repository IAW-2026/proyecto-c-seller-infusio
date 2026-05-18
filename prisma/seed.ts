import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADDRESSES = [
  { address: "Av. Corrientes 1234, CABA", postalCode: "1043" },
  { address: "San Martín 567, Rosario", postalCode: "2000" },
  { address: "Belgrano 890, Córdoba", postalCode: "5000" },
  { address: "Mitre 321, Mendoza", postalCode: "5500" },
];

const BUYER_IDS = ["buyer_001", "buyer_002", "buyer_003", "buyer_004"];

const STATUSES = ["PENDING", "PAYMENT_CONFIRMED", "PREPARING", "DISPATCHED"] as const;

async function main() {
  console.log("Borrando órdenes e ítems existentes...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  const products = await prisma.product.findMany({ where: { isActive: true, sellerId: { not: null } } });
  if (products.length === 0) {
    console.log("No hay productos activos con seller. Abortando.");
    return;
  }

  console.log(`${products.length} producto(s) encontrados.`);

  // Agrupar productos por sellerId
  const bySeller = new Map<string, typeof products>();
  for (const p of products) {
    const sid = p.sellerId!;
    if (!bySeller.has(sid)) bySeller.set(sid, []);
    bySeller.get(sid)!.push(p);
  }

  let i = 0;
  for (const [sellerId, sellerProducts] of bySeller) {
    for (const status of STATUSES) {
      if (i >= 4) break;
      const addr = ADDRESSES[i % ADDRESSES.length];
      const selected = sellerProducts.slice(0, Math.min(2, sellerProducts.length));
      const quantities = selected.map(() => Math.floor(Math.random() * 3) + 1);
      const productTotal = selected.reduce((sum, p, idx) => sum + p.price * quantities[idx], 0);
      const totalAmount = productTotal + 1500;

      const order = await prisma.order.create({
        data: {
          buyerId: BUYER_IDS[i % BUYER_IDS.length],
          sellerId,
          shoppingCartId: `cart_mock_${i + 1}`,
          status,
          totalAmount,
          destinationAddress: addr.address,
          destinationPostalCode: addr.postalCode,
          paymentOrderId: status !== "PENDING" ? `pay_mock_${i + 1}` : null,
          checkoutUrl: status === "PENDING" ? `https://mock-checkout.com/order_${i + 1}` : null,
          shippingId: ["PREPARING", "DISPATCHED"].includes(status) ? `ship_mock_${i + 1}` : null,
        },
      });

      await prisma.orderItem.createMany({
        data: selected.map((p, idx) => ({
          orderId: order.id,
          productId: p.id,
          quantity: quantities[idx],
          unitPrice: p.price,
        })),
      });

      console.log(`Orden ${i + 1}: ${status} | sellerId: ${sellerId} | $${totalAmount}`);
      i++;
    }
  }

  console.log("Seed completado.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
