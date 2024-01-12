import { makeOrder } from 'test/factories/make-order'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { ListOrdersPendingByDeliveryIdUseCase } from './list-orders-pending-by-deliveryman-id'

let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: ListOrdersPendingByDeliveryIdUseCase

describe('List Orders Pendign By DeliveryId', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryAddressRepository,
    )
    sut = new ListOrdersPendingByDeliveryIdUseCase(inMemoryOrderRepository)
  })
  it('should be able to list orders pending by deliveryman id', async () => {
    for (let i = 0; i < 5; i++) {
      const order = makeOrder(
        {
          deliveryId: new UniqueEntityID('deliveryman-01'),
          status: i > 1 ? 'delivered' : 'collected',
        },
        new UniqueEntityID(`order-${i}`),
      )

      await inMemoryOrderRepository.create(order)
    }

    const { value, isRight } = await sut.execute({
      deliverymanId: 'deliveryman-01',
    })

    expect(isRight()).toBe(true)
    expect(value?.orders).toHaveLength(2)
    expect(value?.orders).toEqual([
      expect.objectContaining({
        id: new UniqueEntityID('order-0'),
      }),
      expect.objectContaining({
        id: new UniqueEntityID('order-1'),
      }),
    ])
  })
})
