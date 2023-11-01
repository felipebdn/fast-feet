import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { ListOrdersByDeliveryIdUseCase } from './list-orders-by-deliveryman-id'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: ListOrdersByDeliveryIdUseCase

describe('List Orders By DeliveryId', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new ListOrdersByDeliveryIdUseCase(inMemoryOrderRepository)
  })
  it('should be able to list orders by deliveryman id', async () => {
    for (let i = 0; i < 5; i++) {
      const order = makeOrder(
        {
          deliveryId: new UniqueEntityID('deliveryman-01'),
          withdrawal: new Date(),
        },
        new UniqueEntityID(`order-${i}`),
      )

      await inMemoryOrderRepository.create(order)
    }

    const { orders } = await sut.execute({
      deliverymanId: 'deliveryman-01',
      amount: 3,
      page: 2,
    })

    expect(orders).toHaveLength(2)
    expect(orders).toEqual([
      expect.objectContaining({
        id: new UniqueEntityID('order-3'),
      }),
      expect.objectContaining({
        id: new UniqueEntityID('order-4'),
      }),
    ])
  })
})
