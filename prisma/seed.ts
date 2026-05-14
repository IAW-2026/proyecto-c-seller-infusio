import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.order.createMany({
    data: [
      {
        buyerId: "user_mock_001",
        shoppingCartId: "cart_mock_001",
        totalAmount: 4500,
        status: "PENDING",
        paymentOrderId: "mock_payment_1",
        checkoutUrl: "https://mock-checkout.com/1",
        destinationAddress: "Av. Corrientes 1234",
        destinationPostalCode: "1043",
      },
      {
        buyerId: "user_mock_002",
        shoppingCartId: "cart_mock_002",
        totalAmount: 8200,
        status: "PAYMENT_CONFIRMED",
        paymentOrderId: "mock_payment_2",
        checkoutUrl: "https://mock-checkout.com/2",
        destinationAddress: "Av. Santa Fe 567",
        destinationPostalCode: "1059",
      },
      {
        buyerId: "user_mock_003",
        shoppingCartId: "cart_mock_003",
        totalAmount: 3100,
        status: "PREPARING",
        paymentOrderId: "mock_payment_3",
        checkoutUrl: "https://mock-checkout.com/3",
        destinationAddress: "Calle Belgrano 890",
        destinationPostalCode: "5000",
        shippingId: "mock_shipping_3",
      },
      {
        buyerId: "user_mock_004",
        shoppingCartId: "cart_mock_004",
        totalAmount: 6750,
        status: "DISPATCHED",
        paymentOrderId: "mock_payment_4",
        checkoutUrl: "https://mock-checkout.com/4",
        destinationAddress: "Mitre 321",
        destinationPostalCode: "2000",
        shippingId: "mock_shipping_4",
      },
      {
        buyerId: "user_mock_005",
        shoppingCartId: "cart_mock_005",
        totalAmount: 2900,
        status: "CANCELLED",
        paymentOrderId: "mock_payment_5",
        checkoutUrl: "https://mock-checkout.com/5",
        destinationAddress: "San Martín 456",
        destinationPostalCode: "3000",
      },
    ],
  });

  console.log("Órdenes de prueba creadas.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
