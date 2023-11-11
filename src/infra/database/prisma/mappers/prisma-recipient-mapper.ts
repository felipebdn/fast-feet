import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/logistics/enterprise/entities/recipient'
import { Prisma, Recipient as PrismaRecipient } from '@prisma/client'
export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient) {
    return Recipient.create(
      {
        name: raw.name,
        addressId: new UniqueEntityID(raw.addressId),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      addressId: recipient.addressId.toString(),
      name: recipient.name,
      createdAt: recipient.createdAt,
      updatedAt: recipient.updatedAt,
    }
  }
}
