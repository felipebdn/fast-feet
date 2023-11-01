import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ListOrdersCompletedByDeliveryIdUseCase } from './list-orders-completed-by-deliveryman-id'

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: ListOrdersCompletedByDeliveryIdUseCase

describe('List Orders Completed By DeliveryId', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new ListOrdersCompletedByDeliveryIdUseCase(inMemoryOrderRepository)
  })
  it('should be able to list orders completed by deliveryman id', async () => {
    for (let i = 0; i < 5; i++) {
      const order = makeOrder(
        {
          deliveryId: new UniqueEntityID('deliveryman-01'),
          collected: new Date(),
          delivered: i > 1 ? new Date() : undefined,
        },
        new UniqueEntityID(`order-${i}`),
      )

      await inMemoryOrderRepository.create(order)
    }

    const { value, isRight } = await sut.execute({
      deliverymanId: 'deliveryman-01',
    })

    expect(isRight()).toBe(true)
    expect(value?.orders).toHaveLength(3)
    expect(value?.orders).toEqual([
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
