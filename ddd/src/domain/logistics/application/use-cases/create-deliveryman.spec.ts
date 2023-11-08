import { InMemoryDeliverymanRepository } from 'test/repositories/in-memeory-deliveryman-repository'
import { CreateDeliverymanUseCase } from './create-deliveryman'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let sut: CreateDeliverymanUseCase

describe('Create Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    sut = new CreateDeliverymanUseCase(inMemoryDeliverymanRepository)
  })
  it('should be able to create a new deliveryman', async () => {
    const result = await sut.execute({
      addressId: 'address-01',
      cpf: '000.000.000-41',
      hash_password: '123456',
      name: 'deliveryman name',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0].id).toBeTruthy()
    expect(inMemoryDeliverymanRepository.items[0].cpf).toBe('000.000.000-41')
    expect(inMemoryDeliverymanRepository.items[0].addressId).toEqual(
      new UniqueEntityID('address-01'),
    )
  })
})
