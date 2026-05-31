import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADDRESSES = [
  { address: "Av. Corrientes 1234, CABA", postalCode: "1043" },
  { address: "San Martín 567, Rosario", postalCode: "2000" },
  { address: "Belgrano 890, Córdoba", postalCode: "5000" },
  { address: "Mitre 321, Mendoza", postalCode: "5500" },
  { address: "9 de Julio 100, Tucumán", postalCode: "4000" },
  { address: "Rivadavia 432, Mar del Plata", postalCode: "7600" },
];

const BUYER_IDS = [
  "buyer_001", "buyer_002", "buyer_003",
  "buyer_004", "buyer_005", "buyer_006",
];

const ALL_STATUSES = [
  "PENDING",
  "PAYMENT_CONFIRMED",
  "PREPARING",
  "DISPATCHED",
  "DELIVERED",
  "CANCELLED",
] as const;

// Genera una fecha en el pasado: daysAgo días atrás + variación de horas
function daysAgo(days: number, hourOffset = 0): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hourOffset);
  return d;
}

async function main() {
  console.log("Borrando órdenes e ítems existentes...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  const products = await prisma.product.findMany({
    where: { isActive: true, sellerId: { not: null } },
  });

  if (products.length === 0) {
    console.log("No hay productos activos con seller. Abortando.");
    return;
  }

  console.log(`${products.length} producto(s) encontrados.`);

  const bySeller = new Map<string, typeof products>();
  for (const p of products) {
    const sid = p.sellerId!;
    if (!bySeller.has(sid)) bySeller.set(sid, []);
    bySeller.get(sid)!.push(p);
  }

  let totalCreated = 0;

  for (const [sellerId, sellerProducts] of bySeller) {
    // 5 rondas × 6 estados = 30 órdenes por seller (3 páginas completas)
    const ROUNDS = 5;

    for (let round = 0; round < ROUNDS; round++) {
      for (const status of ALL_STATUSES) {
        const idx = totalCreated;
        const addr = ADDRESSES[idx % ADDRESSES.length];
        const buyerId = BUYER_IDS[idx % BUYER_IDS.length];

        // Tomar 1 o 2 productos al azar
        const count = (idx % 2 === 0) ? 1 : Math.min(2, sellerProducts.length);
        const selected = sellerProducts.slice(0, count);
        const quantities = selected.map(() => (idx % 3) + 1);
        const subtotal = selected.reduce((sum, p, i) => sum + p.price * quantities[i], 0);
        const shippingCost = [500, 800, 1200, 1500, 2000][idx % 5];
        const totalAmount = subtotal + shippingCost;

        // Fechas escalonadas: orden más reciente = hace 1 día, más antigua = hace ~90 días
        const createdAt = daysAgo(idx * 3 + 1, idx % 12);

        const order = await prisma.order.create({
          data: {
            buyerId,
            sellerId,
            shoppingCartId: `cart_mock_${idx + 1}`,
            status,
            totalAmount,
            shippingCost,
            destinationAddress: addr.address,
            destinationPostalCode: addr.postalCode,
            paymentOrderId: status !== "PENDING" ? `pay_mock_${idx + 1}` : null,
            checkoutUrl: status === "PENDING" ? `https://mock-checkout.com/order_${idx + 1}` : null,
            shippingId: ["DISPATCHED", "DELIVERED"].includes(status)
              ? `ship_mock_${idx + 1}`
              : null,
            createdAt,
          },
        });

        await prisma.orderItem.createMany({
          data: selected.map((p, i) => ({
            orderId: order.id,
            productId: p.id,
            quantity: quantities[i],
            unitPrice: p.price,
          })),
        });

        console.log(`  #${idx + 1} ${status.padEnd(18)} | $${totalAmount.toLocaleString("es-AR")}`);
        totalCreated++;
      }
    }
  }

  console.log(`\nSeed completado: ${totalCreated} órdenes creadas.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
