import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ListOrdersCompletedByDeliveryIdUseCase } from './list-orders-completed-by-deliveryman-id'

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: ListOrdersCompletedByDeliveryIdUseCase

describe('List Orders By DeliveryId', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new ListOrdersCompletedByDeliveryIdUseCase(inMemoryOrderRepository)
  })
  it('should be able to list orders by deliveryman id', async () => {
    for (let i = 0; i < 5; i++) {
      const order = makeOrder(
        {
          deliveryId: new UniqueEntityID('deliveryman-01'),
          withdrawal: new Date(),
          availablePickup: i > 1 ? new Date() : undefined,
        },
        new UniqueEntityID(`order-${i}`),
      )

      await inMemoryOrderRepository.create(order)
    }

    const { orders } = await sut.execute({
      deliverymanId: 'deliveryman-01',
    })

    expect(orders).toHaveLength(3)
    expect(orders).toEqual([
      expect.objectContaining({
        id: new UniqueEntityID('order-2'),
      }),
      expect.objectContaining({
        id: new UniqueEntityID('order-3'),
      }),
      expect.objectContaining({
        id: new UniqueEntityID('order-4'),
      }),
    ])
  })
})
