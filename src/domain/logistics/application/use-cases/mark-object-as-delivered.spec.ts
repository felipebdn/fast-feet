import { makeOrder } from 'test/factories/make-order'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderNotIsColectedError } from '@/core/errors/errors/order-not-is-colected-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { MarkObjectAsDeliveredUseCase } from './mark-object-as-delivered'

let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: MarkObjectAsDeliveredUseCase

describe('Create Deliveryman', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryAddressRepository,
    )
    sut = new MarkObjectAsDeliveredUseCase(inMemoryOrderRepository)
  })
  it('should be able to create a new deliveryman', async () => {
    const order = makeOrder({
      deliveryId: new UniqueEntityID(),
      status: 'collected',
    })
    await inMemoryOrderRepository.create(order)

    expect(inMemoryOrderRepository.items[0].status).toBe('collected')

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0].status).toBe('delivered')
  })

  it('should not be able to mark order as deliverid because order not exists', async () => {
    const result = await sut.execute({
      orderId: 'order-01',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to mark order as deliverid because order not colected', async () => {
    const order = makeOrder()
    await inMemoryOrderRepository.create(order)

    expect(inMemoryOrderRepository.items[0].status).toBe('waiting')

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(OrderNotIsColectedError)
  })
})
