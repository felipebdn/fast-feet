import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Address } from '@/domain/logistics/enterprise/entities/address'
import { Address as PrismaAddress } from '@prisma/client'

export class PrismaAddressMapper {
  static toDomain(raw: PrismaAddress) {
    return Address.create(
      {
        city: raw.city,
        code: raw.code,
        complement: raw.complement,
        county: raw.county,
        state: raw.state,
        street: raw.street,
        createdAt: raw.createdAt,
        number: raw.number,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
