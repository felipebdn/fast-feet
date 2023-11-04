import { makeOrder } from 'test/factories/make-order'
import { OnMarkOrderColected } from './on-mark-order-colected'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryOrderRepository: InMemoryOrderRepository

describe('On Marl Order Colected', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryAddressRepository,
    )
  })

  it.skip('should send a notification when as mark order is coleted', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onMarkOrderColected = new OnMarkOrderColected()

    const order = makeOrder()

    await inMemoryOrderRepository.create(order)

    console.log('teste', inMemoryOrderRepository.items[0].collected)

    order.markAsCollected(new UniqueEntityID('deliveryman-01'))
    expect(inMemoryOrderRepository.items[0].collected).toBe(undefined)

    await inMemoryOrderRepository.save(order)
  })
})
