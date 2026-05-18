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

  const sellers = await prisma.seller.findMany();
  if (sellers.length === 0) {
    console.log("No hay sellers. Abortando.");
    return;
  }

  const products = await prisma.product.findMany({ where: { isActive: true } });
  if (products.length === 0) {
    console.log("No hay productos. Abortando.");
    return;
  }

  console.log(`${sellers.length} seller(s), ${products.length} producto(s) encontrados.`);

  for (let i = 0; i < 4; i++) {
    const seller = sellers[i % sellers.length];
    const status = STATUSES[i];
    const addr = ADDRESSES[i];

    // Productos de este seller (o sin seller asignado como fallback)
    const pool = products.filter((p) => p.sellerId === seller.id || p.sellerId === null);
    if (pool.length === 0) continue;

    const selected = pool.slice(0, Math.min(2, pool.length));
    const quantities = selected.map(() => Math.floor(Math.random() * 3) + 1);
    const productTotal = selected.reduce((sum, p, idx) => sum + p.price * quantities[idx], 0);
    const totalAmount = productTotal + 1500;

    const order = await prisma.order.create({
      data: {
        buyerId: BUYER_IDS[i],
        sellerId: seller.id,
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

    console.log(`Orden ${i + 1}: ${status} | ${seller.name} | $${totalAmount}`);
  }

  console.log("Seed completado.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
