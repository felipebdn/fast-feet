-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_delivery_id_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "delivery_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_id_fkey" FOREIGN KEY ("delivery_id") REFERENCES "delivery_mens"("id") ON DELETE SET NULL ON UPDATE CASCADE;
