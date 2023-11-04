import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Deliveryman,
  DeliverymanProps,
} from '@/domain/logistics/enterprise/entities/deliveryman'
import { faker } from '@faker-js/faker'

export function makeDeliveryman(
  override: Partial<DeliverymanProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryman = Deliveryman.create(
    {
      cpf: faker.phone.number(),
      hash_password: faker.person.lastName(),
      name: faker.person.fullName(),
      updatedAt: undefined,
      ...override,
    },
    id,
  )

  return deliveryman
}
