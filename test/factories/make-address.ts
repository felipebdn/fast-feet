import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Address,
  AddressProps,
} from '@/domain/logistics/enterprise/entities/address'
import { PrismaAddressMapper } from '@/infra/database/prisma/mappers/prisma-address-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeAddress(
  override: Partial<AddressProps> = {},
  id?: UniqueEntityID,
) {
  const address = Address.create(
    {
      city: faker.location.city(),
      code: faker.location.zipCode(),
      complement: faker.location.secondaryAddress(),
      number: parseInt(faker.location.buildingNumber()),
      county: faker.location.county(),
      state: faker.location.state(),
      street: faker.location.street(),
      ...override,
    },
    id,
  )

  return address
}

@Injectable()
export class AddressFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaAddress(data: Partial<AddressProps> = {}): Promise<Address> {
    const address = makeAddress(data)

    await this.prismaService.address.create({
      data: PrismaAddressMapper.toPrisma(address),
    })

    return address
  }
}
