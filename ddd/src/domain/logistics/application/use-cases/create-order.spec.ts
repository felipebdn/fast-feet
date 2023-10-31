import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { CreateOrderUseCase } from './create-order'

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new CreateOrderUseCase(inMemoryOrderRepository)
  })
  it('should be able to create a new order of delivery', async () => {
    const { order } = await sut.execute({
      bulk: 3,
      recipientId: 'recipient-id',
      rotule: 'caixa',
      weight: 35,
    })

    expect(order.id).toBeTruthy()
    expect(inMemoryOrderRepository.items[0].id).toEqual(order.id)
  })
})
