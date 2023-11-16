import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Deliveryman } from '@/domain/logistics/enterprise/entities/deliveryman'
import { Prisma, Deliveryman as PrismaDeliveryman } from '@prisma/client'

export class PrismaDeliverymanMapper {
  static toDomain(raw: PrismaDeliveryman) {
    return Deliveryman.create(
      {
        cpf: raw.cpf,
        hash_password: raw.password_hash,
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
      password_hash: deliveryman.hash_password,
      createdAt: deliveryman.createdAt,
      updatedAt: deliveryman.updatedAt,
    }
  }
}
