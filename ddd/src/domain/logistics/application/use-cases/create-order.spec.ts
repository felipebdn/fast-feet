import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { CreateOrderUseCase } from './create-order'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { faker } from '@faker-js/faker'
import { makeOrder } from 'test/factories/make-order'
import { ValueAlreadyExistsError } from './errors/value-already-exists-error'

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
    const result = await sut.execute({
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
        code: 'code-01',
        bulk: faker.number.float({ min: 0 }),
        rotule: faker.lorem.sentence(3),
        weight: faker.number.float({ min: 0 }),
      },
    })

    expect(result.isRight()).toBe(true)
  })
  it('should not be able to create a new order of already exists code', async () => {
    inMemoryOrderRepository.create(
      makeOrder({
        code: 'code-01',
      }),
    )

    const result = await sut.execute({
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
        code: 'code-01',
        bulk: faker.number.float({ min: 0 }),
        rotule: faker.lorem.sentence(3),
        weight: faker.number.float({ min: 0 }),
      },
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(ValueAlreadyExistsError)
  })
})
