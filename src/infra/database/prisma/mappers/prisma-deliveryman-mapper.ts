import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Deliveryman } from '@/domain/logistics/enterprise/entities/deliveryman'
import { Deliveryman as PrismaDeliveryman } from '@prisma/client'

export class PrismaDeliverymanMapper {
  static toDomain(raw: PrismaDeliveryman) {
    return Deliveryman.create({
      addressId: new UniqueEntityID(raw.addressId),
      cpf: raw.cpf,
      hash_password: raw.password_hash,
      name: raw.name,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
