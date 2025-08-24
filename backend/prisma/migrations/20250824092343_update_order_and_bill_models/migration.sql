/*
  Warnings:

  - You are about to drop the column `cartItemId` on the `orders` table. All the data in the column will be lost.
  - Added the required column `price` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productModelId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_cartItemId_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "cartItemId",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "productModelId" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_productModelId_fkey" FOREIGN KEY ("productModelId") REFERENCES "product_models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
