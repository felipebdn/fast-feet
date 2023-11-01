import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/logistics/enterprise/entities/order'
import { faker } from '@faker-js/faker'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      addressId: new UniqueEntityID(),
      recipientId: new UniqueEntityID(),
      bulk: faker.number.float({ min: 0 }),
      code: faker.lorem.sentence(2),
      rotule: faker.lorem.sentence(3),
      weight: faker.number.float({ min: 0 }),
      ...override,
    },
    id,
  )

  return order
}
