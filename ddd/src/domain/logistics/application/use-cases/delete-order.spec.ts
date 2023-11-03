import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { DeleteOrderUseCase } from './delete-order'
import { makeAddress } from 'test/factories/make-address'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeOrder } from 'test/factories/make-order'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: DeleteOrderUseCase

describe('Create Deliveryman', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryAddressRepository,
    )
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new DeleteOrderUseCase(
      inMemoryOrderRepository,
      inMemoryAddressRepository,
      inMemoryRecipientRepository,
    )
  })
  it('should be able to create a new deliveryman', async () => {
    const address = makeAddress()
    await inMemoryAddressRepository.create(address)
    const recipient = makeRecipient()
    await inMemoryRecipientRepository.create(recipient)
    const order = makeOrder({
      addressId: address.id,
      recipientId: recipient.id,
    })
    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({ orderId: order.id.toString() })

    expect(inMemoryOrderRepository.items).toHaveLength(0)
    expect(result.isRight()).toBe(true)
  })
})
