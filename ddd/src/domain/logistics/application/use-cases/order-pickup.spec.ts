import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { OrderPuckupUseCase } from './order-pickup'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ObjectAlreadyResponsibleDeliveryman } from './errors/object-already-responsible-deliveryman-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

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

    const result = await sut.execute({
      deliverymanId: 'deliveryman-id',
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0].deliveryId?.toString()).toEqual(
      'deliveryman-id',
    )
  })
  it('should be not able to collect a delivery another deliveryId', async () => {
    const order = makeOrder({
      deliveryId: new UniqueEntityID('deliveryman-01'),
    })
    inMemoryOrderRepository.items.push(order)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-id',
      orderId: order.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ObjectAlreadyResponsibleDeliveryman)
  })
  it('should be not able to collect a order not exists', async () => {
    const result = await sut.execute({
      deliverymanId: 'deliveryman-id',
      orderId: 'order-01',
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
