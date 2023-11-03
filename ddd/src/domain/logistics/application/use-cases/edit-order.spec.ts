import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { EditOrderUseCase } from './edit-order'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'

let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: EditOrderUseCase

describe('Edit Order', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryAddressRepository,
    )
    sut = new EditOrderUseCase(inMemoryOrderRepository)
  })
  it('should be able to edit order', async () => {
    const order = makeOrder(
      {
        bulk: 3,
        weight: 3,
        rotule: 'order example',
      },
      new UniqueEntityID('order-01'),
    )
    await inMemoryOrderRepository.create(order)

    await sut.execute({
      orderId: 'order-01',
      bulk: 4,
      rotule: 'example order',
      weight: 4,
    })

    expect(inMemoryOrderRepository.items[0]).toEqual(
      expect.objectContaining({
        bulk: 4,
        rotule: 'example order',
        weight: 4,
      }),
    )
  })

  it('should be able to edit with recipientId and deliveryId', async () => {
    const order = makeOrder(
      {
        bulk: 3,
        weight: 3,
        rotule: 'order example',
      },
      new UniqueEntityID('order-01'),
    )
    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      orderId: 'order-01',
      bulk: 4,
      rotule: 'example order',
      weight: 4,
      deliverymanId: 'deliveryman-01',
      recipientId: 'recipient-01',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0]).toEqual(
      expect.objectContaining({
        bulk: 4,
        rotule: 'example order',
        weight: 4,
        deliveryId: new UniqueEntityID('deliveryman-01'),
        recipientId: new UniqueEntityID('recipient-01'),
      }),
    )
  })
})
