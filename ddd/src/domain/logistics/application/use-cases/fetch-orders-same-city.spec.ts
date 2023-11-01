import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { FetchOrderSameCityUseCase } from './fetch-orders-same-city'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { makeAddress } from 'test/factories/make-address'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: FetchOrderSameCityUseCase

describe('Fetch Orders Same City And State', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryAddressRepository,
    )
    sut = new FetchOrderSameCityUseCase(inMemoryOrderRepository)
  })
  it('should be able to fetch orders of delivery same city and state', async () => {
    for (let i = 0; i < 5; i++) {
      const address = makeAddress(
        {
          city: i <= 2 ? 'city name' : 'name city',
          state: 'state name',
        },
        new UniqueEntityID(`address${i}`),
      )
      await inMemoryAddressRepository.create(address)
      const order = makeOrder(
        {
          addressId: new UniqueEntityID(`address${i}`),
        },
        new UniqueEntityID(`order-${i}`),
      )
      await inMemoryOrderRepository.create(order)
    }

    const result1 = await sut.execute({
      city: 'city name',
      state: 'state name',
      amount: 4,
      page: 1,
    })

    expect(result1.isRight()).toBe(true)
    expect(result1.value?.orders).toEqual([
      expect.objectContaining({
        id: new UniqueEntityID('order-0'),
      }),
      expect.objectContaining({
        id: new UniqueEntityID('order-1'),
      }),
      expect.objectContaining({
        id: new UniqueEntityID('order-2'),
      }),
    ])

    const result2 = await sut.execute({
      city: 'name city',
      state: 'state name',
      amount: 4,
      page: 1,
    })

    expect(result2.isRight()).toBe(true)
    expect(result2.value?.orders).toEqual([
      expect.objectContaining({
        id: new UniqueEntityID('order-3'),
      }),
      expect.objectContaining({
        id: new UniqueEntityID('order-4'),
      }),
    ])
  })
})
