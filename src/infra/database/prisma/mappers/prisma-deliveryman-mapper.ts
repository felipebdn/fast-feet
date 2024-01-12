import { Deliveryman as PrismaDeliveryman, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Deliveryman } from '@/domain/logistics/enterprise/entities/deliveryman'

export class PrismaDeliverymanMapper {
  static toDomain(raw: PrismaDeliveryman) {
    return Deliveryman.create(
      {
        cpf: raw.cpf,
        password_hash: raw.password_hash,
        name: raw.name,
        role: raw.role,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    deliveryman: Deliveryman,
  ): Prisma.DeliverymanUncheckedCreateInput {
    return {
      id: deliveryman.id.toString(),
      cpf: deliveryman.cpf,
      name: deliveryman.name,
      role: deliveryman.role,
      password_hash: deliveryman.password_hash,
      createdAt: deliveryman.createdAt,
      updatedAt: deliveryman.updatedAt,
    }
  }
}
