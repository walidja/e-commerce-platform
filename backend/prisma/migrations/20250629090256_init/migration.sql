/*
  Warnings:

  - Made the column `mobile` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "address" TEXT,
ALTER COLUMN "mobile" SET NOT NULL;
