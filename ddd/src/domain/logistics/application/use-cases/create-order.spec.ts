import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { CreateOrderUseCase } from './create-order'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { faker } from '@faker-js/faker'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryAddressRepository = new InMemoryAddressRepository()
    sut = new CreateOrderUseCase(
      inMemoryOrderRepository,
      inMemoryRecipientRepository,
      inMemoryAddressRepository,
    )
  })
  it('should be able to create a new order of delivery', async () => {
    const { address, order, recipient } = await sut.execute({
      address: {
        city: faker.location.city(),
        code: faker.location.zipCode(),
        complement: faker.location.secondaryAddress(),
        number: parseInt(faker.location.buildingNumber()),
        county: faker.location.county(),
        state: faker.location.state(),
        street: faker.location.street(),
      },
      recipient: {
        name: faker.person.fullName(),
      },
      order: {
        bulk: faker.number.float({ min: 0 }),
        rotule: faker.lorem.sentence(3),
        weight: faker.number.float({ min: 0 }),
      },
    })

    expect(order.id).toBeTruthy()
    expect(inMemoryOrderRepository.items[0].id).toEqual(order.id)
    expect(inMemoryRecipientRepository.items[0].id).toEqual(recipient.id)
    expect(inMemoryAddressRepository.items[0].id).toEqual(address.id)
  })
})
