/*
  Warnings:

  - You are about to drop the column `address_id` on the `delivery_mens` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "delivery_mens" DROP CONSTRAINT "delivery_mens_address_id_fkey";

-- DropIndex
DROP INDEX "delivery_mens_address_id_key";

-- AlterTable
ALTER TABLE "delivery_mens" DROP COLUMN "address_id";
