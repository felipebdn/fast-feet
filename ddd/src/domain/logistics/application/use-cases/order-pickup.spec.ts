import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { OrderPuckupUseCase } from './order-pickup'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: OrderPuckupUseCase

describe('Order Pickup', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new OrderPuckupUseCase(inMemoryOrderRepository)
  })
  it('should be able to collect a delivery', async () => {
    const order = makeOrder()
    inMemoryOrderRepository.items.push(order)

    await sut.execute({
      deliverymanId: 'deliveryman-id',
      orderId: order.id.toString(),
    })

    expect(inMemoryOrderRepository.items[0].deliveryId?.toString()).toEqual(
      'deliveryman-id',
    )
  })
  it('should be not able to collect a delivery another deliveryId', async () => {
    const order = makeOrder({
      deliveryId: new UniqueEntityID('deliveryman-01'),
    })
    inMemoryOrderRepository.items.push(order)

    expect(() => {
      return sut.execute({
        deliverymanId: 'deliveryman-id',
        orderId: order.id.toString(),
      })
    }).rejects.toBeInstanceOf(Error)
  })
  it('should be not able to collect a order not exists', async () => {
    expect(() => {
      return sut.execute({
        deliverymanId: 'deliveryman-id',
        orderId: 'order-01',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
