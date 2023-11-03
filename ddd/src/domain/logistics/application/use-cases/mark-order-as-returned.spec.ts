import { expect } from 'vitest'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { MarkOrderAsReturnedUseCase } from './mark-order-as-returned'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderNotIsColectedError } from './errors/order-not-is-colected-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'

let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: MarkOrderAsReturnedUseCase

describe('Mark Order As Returned', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryAddressRepository,
    )
    sut = new MarkOrderAsReturnedUseCase(inMemoryOrderRepository)
  })
  it('should be able to mark order as returned', async () => {
    const order = makeOrder({
      collected: new Date(),
      deliveryId: new UniqueEntityID(),
    })
    await inMemoryOrderRepository.create(order)

    expect(inMemoryOrderRepository.items[0].returned).toBe(undefined)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0].returned).toEqual(expect.any(Date))
  })

  it('should not be able to mark order as returned because order not exists', async () => {
    const result = await sut.execute({
      orderId: 'order-01',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to mark order as returned because order not colected', async () => {
    const order = makeOrder()
    await inMemoryOrderRepository.create(order)

    expect(inMemoryOrderRepository.items[0].returned).toBe(undefined)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(OrderNotIsColectedError)
  })
})
