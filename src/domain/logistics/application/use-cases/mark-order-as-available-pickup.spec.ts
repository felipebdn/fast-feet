import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { MarkOrderIsAvailablePickupUseCase } from './mark-order-as-available-pickup'
import { OrderNotIsReturnedError } from './errors/order-not-returned-error'

let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: MarkOrderIsAvailablePickupUseCase

describe('Mark Order As Available Pickup', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryAddressRepository,
    )
    sut = new MarkOrderIsAvailablePickupUseCase(inMemoryOrderRepository)
  })
  it('should be able to mark order as available pickup', async () => {
    const order = makeOrder({
      status: 'returned',
      deliveryId: new UniqueEntityID(),
    })
    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0].status).toEqual('availablePickup')
  })

  it('should not be able to mark order on hold because it has not been returned', async () => {
    const order = makeOrder()
    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(OrderNotIsReturnedError)
  })
})
