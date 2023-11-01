import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { makeOrder } from 'test/factories/make-order'
import { MarkOrderAsWaitingUseCase } from './mark-order-as-waiting'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: MarkOrderAsWaitingUseCase

describe('Mark Order As Waiting', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new MarkOrderAsWaitingUseCase(inMemoryOrderRepository)
  })
  it('should be able to mark order as waiting', async () => {
    const order = makeOrder({
      collected: new Date(),
      deliveryId: new UniqueEntityID(),
    })
    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0].availablePickup).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to mark order on hold because it has not been collected', async () => {
    const order = makeOrder()
    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
  })
})
