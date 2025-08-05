/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `shops` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `shops` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "shops_userId_key" ON "shops"("userId");

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
