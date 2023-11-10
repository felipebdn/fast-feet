/*
  Warnings:

  - You are about to drop the `delivery_men` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "delivery_men" DROP CONSTRAINT "delivery_men_address_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_delivery_id_fkey";

-- DropTable
DROP TABLE "delivery_men";

-- CreateTable
CREATE TABLE "delivery_mens" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "address_id" TEXT NOT NULL,

    CONSTRAINT "delivery_mens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "delivery_mens_cpf_key" ON "delivery_mens"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "delivery_mens_address_id_key" ON "delivery_mens"("address_id");

-- AddForeignKey
ALTER TABLE "delivery_mens" ADD CONSTRAINT "delivery_mens_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "delivery_mens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
