import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryDeliverymanRepository } from 'test/repositories/in-memeory-deliveryman-repository'
import { EditDeliverymanUseCase } from './edit-deliveryman'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let sut: EditDeliverymanUseCase

describe('Edit Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    sut = new EditDeliverymanUseCase(inMemoryDeliverymanRepository)
  })
  it('should be able to edit deliveryman', async () => {
    const deliveryman = makeDeliveryman(
      {
        addressId: new UniqueEntityID('address-01'),
        cpf: '000.000.000-00',
        name: 'name example',
        hash_password: '123456',
      },
      new UniqueEntityID('deliveryman-01'),
    )

    await inMemoryDeliverymanRepository.create(deliveryman)

    const result = await sut.execute({
      addressId: 'address-01',
      deliverymanId: 'deliveryman-01',
      cpf: '111.111.111-11',
      hash_password: '654321',
      name: 'example name',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0]).toEqual(
      expect.objectContaining({
        id: new UniqueEntityID('deliveryman-01'),
        cpf: '111.111.111-11',
        hash_password: '654321',
        name: 'example name',
      }),
    )
  })
})