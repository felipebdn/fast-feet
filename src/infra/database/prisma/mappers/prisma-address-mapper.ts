import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Address } from '@/domain/logistics/enterprise/entities/address'
import { Prisma, Address as PrismaAddress } from '@prisma/client'

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

  static toPrisma(address: Address): Prisma.AddressUncheckedCreateInput {
    return {
      city: address.city,
      code: address.code,
      county: address.county,
      state: address.state,
      street: address.street,
      complement: address.complement,
      createdAt: address.createdAt,
      id: address.id.toString(),
      updatedAt: address.updatedAt,
      number: address.number,
    }
  }
}
