import { InMemoryDeliverymanRepository } from 'test/repositories/in-memeory-deliveryman-repository'
import { CreateDeliverymanUseCase } from './create-deliveryman'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let fakeHasher: FakeHasher
let sut: CreateDeliverymanUseCase

describe('Create Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    fakeHasher = new FakeHasher()
    sut = new CreateDeliverymanUseCase(
      inMemoryDeliverymanRepository,
      fakeHasher,
    )
  })
  it('should be able to create a new deliveryman', async () => {
    const result = await sut.execute({
      addressId: 'address-01',
      cpf: '000.000.000-41',
      password: '123456',
      name: 'deliveryman name',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0].id).toBeTruthy()
    expect(inMemoryDeliverymanRepository.items[0].cpf).toBe('000.000.000-41')
    expect(inMemoryDeliverymanRepository.items[0].addressId).toEqual(
      new UniqueEntityID('address-01'),
    )
    expect(inMemoryDeliverymanRepository.items[0].hash_password).toBe(
      '123456-hashed',
    )
  })
})
