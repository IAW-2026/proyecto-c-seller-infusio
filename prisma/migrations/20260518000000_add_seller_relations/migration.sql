-- AlterTable: agregar sellerId a Product
ALTER TABLE "Product" ADD COLUMN "sellerId" TEXT;

-- AlterTable: agregar sellerId a Order
ALTER TABLE "Order" ADD COLUMN "sellerId" TEXT;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;
