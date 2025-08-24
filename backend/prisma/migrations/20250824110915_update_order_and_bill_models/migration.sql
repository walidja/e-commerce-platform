-- AlterTable
ALTER TABLE "carts" ALTER COLUMN "paymentIntentId" DROP NOT NULL,
ALTER COLUMN "paymentIntentId" DROP DEFAULT;
