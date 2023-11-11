import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/logistics/enterprise/entities/order'
import { Prisma, Order as PrismaOrder } from '@prisma/client'
export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder) {
    return Order.create(
      {
        addressId: new UniqueEntityID(raw.addressId),
        bulk: raw.bulk,
        code: raw.code,
        recipientId: new UniqueEntityID(raw.recipientId),
        rotule: raw.rotule,
        weight: raw.weight,
        createdAt: raw.createdAt,
        deliveryId: raw.deliverymanId
          ? new UniqueEntityID(raw.deliverymanId)
          : null,
        status: raw.status,
        updateAtStatus: raw.updateAtStatus,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      addressId: order.addressId.toString(),
      recipientId: order.recipientId.toString(),
      deliverymanId: order.deliveryId?.toString(),
      bulk: order.bulk,
      code: order.code,
      rotule: order.rotule,
      status: order.status,
      updateAtStatus: order.updateAtStatus,
      weight: order.weight,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}
