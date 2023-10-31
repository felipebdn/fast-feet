import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Address,
  AddressProps,
} from '@/domain/logistics/enterprise/entities/address'
import { faker } from '@faker-js/faker'

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
      sector: faker.location.county(),
      state: faker.location.state(),
      road: faker.location.street(),
      ...override,
    },
    id,
  )

  return address
}
