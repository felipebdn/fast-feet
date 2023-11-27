import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { CreateOrderUseCase } from './create-order'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { faker } from '@faker-js/faker'

let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryAddressRepository,
    )
    sut = new CreateOrderUseCase(inMemoryOrderRepository)
  })
  it('should be able to create a new order of delivery', async () => {
    const result = await sut.execute({
      addressId: 'address-01',
      recipientId: 'address-01',
      code: 'code-01',
      bulk: faker.number.float({ min: 0 }),
      rotule: faker.lorem.sentence(3),
      weight: faker.number.float({ min: 0 }),
    })

    expect(result.isRight()).toBe(true)
  })
})
