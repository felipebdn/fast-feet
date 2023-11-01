import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { MarkObjectAsDeliveredUseCase } from './mark-object-as-delivered'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: MarkObjectAsDeliveredUseCase

describe('Create Deliveryman', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new MarkObjectAsDeliveredUseCase(inMemoryOrderRepository)
  })
  it('should be able to create a new deliveryman', async () => {
    const order = makeOrder({
      deliveryId: new UniqueEntityID(),
      collected: new Date(),
    })
    await inMemoryOrderRepository.create(order)

    expect(inMemoryOrderRepository.items[0].delivered).toBe(undefined)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0].delivered).toEqual(expect.any(Date))
  })
})
