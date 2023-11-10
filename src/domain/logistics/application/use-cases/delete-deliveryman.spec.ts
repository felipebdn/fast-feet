import { InMemoryDeliverymanRepository } from 'test/repositories/in-memeory-deliveryman-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { DeleteDeliverymanUseCase } from './delete-deliveryman'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let sut: DeleteDeliverymanUseCase

describe('Delete Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    sut = new DeleteDeliverymanUseCase(inMemoryDeliverymanRepository)
  })
  it('should be able to delete a deliveryman', async () => {
    const deliveryman = makeDeliveryman(
      {},
      new UniqueEntityID('deliveriman-01'),
    )
    inMemoryDeliverymanRepository.create(deliveryman)

    const result = await sut.execute({
      deliverymanId: 'deliveriman-01',
    })

    expect(inMemoryDeliverymanRepository.items).toHaveLength(0)
    expect(result.isRight()).toBe(true)
  })
  it('should not be able to delete a deliveryman', async () => {
    const deliveryman = makeDeliveryman(
      {},
      new UniqueEntityID('deliveriman-01'),
    )
    inMemoryDeliverymanRepository.create(deliveryman)

    const result = await sut.execute({
      deliverymanId: 'deliveriman-02',
    })

    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(result.isLeft()).toBe(true)
  })
})
