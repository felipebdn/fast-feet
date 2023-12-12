import { expect } from 'vitest'
import { faker } from '@faker-js/faker'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { CreateOrderUseCase } from './create-order'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { makeOrder } from 'test/factories/make-order'
import { ValueAlreadyExistsError } from '@/core/errors/errors/value-already-exists-error'
import { InMemoryTransactions } from 'test/transactions/unit-of-work-test'

let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let transaction: InMemoryTransactions
let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    transaction = new InMemoryTransactions()
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryAddressRepository,
    )
    sut = new CreateOrderUseCase(
      transaction,
      inMemoryOrderRepository,
      inMemoryAddressRepository,
      inMemoryRecipientRepository,
    )
  })
  it('should be able to create a new order of delivery', async () => {
    const result = await sut.execute({
      order: {
        code: 'code-01',
        bulk: faker.number.float({ min: 0 }),
        rotule: faker.lorem.sentence(3),
        weight: faker.number.float({ min: 0 }),
      },
      address: {
        city: faker.location.city(),
        code: faker.location.zipCode(),
        complement: faker.location.secondaryAddress(),
        number: parseInt(faker.location.buildingNumber()),
        county: faker.location.county(),
        state: 'Pará',
        street: faker.location.street(),
      },
      recipient: {
        name: 'John Doe',
      },
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAddressRepository.items[0].state).toBe('Pará')
    expect(inMemoryRecipientRepository.items[0].name).toBe('John Doe')
    expect(inMemoryOrderRepository.items[0].code).toBe('code-01')
  })
  it('should not be able to create a new order of delivery', async () => {
    const order = makeOrder({
      code: 'code-01',
    })
    inMemoryOrderRepository.items.push(order)

    const result = await sut.execute({
      order: {
        code: 'code-01',
        bulk: faker.number.float({ min: 0 }),
        rotule: faker.lorem.sentence(3),
        weight: faker.number.float({ min: 0 }),
      },
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
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ValueAlreadyExistsError)
  })
})
