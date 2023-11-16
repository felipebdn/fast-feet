import { InMemoryDeliverymanRepository } from 'test/repositories/in-memeory-deliveryman-repository'
import { CreateDeliverymanUseCase } from './create-deliveryman'
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
      cpf: '000.000.000-41',
      password: '123456',
      name: 'deliveryman name',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0].id).toBeTruthy()
    expect(inMemoryDeliverymanRepository.items[0].cpf).toBe('000.000.000-41')
    expect(inMemoryDeliverymanRepository.items[0].hash_password).toBe(
      '123456-hashed',
    )
  })

  it('should be able to create a adm', async () => {
    const result = await sut.execute({
      cpf: '000.000.000-41',
      password: '123456',
      name: 'deliveryman name',
      role: 'ADMIN',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0].role).toBe('ADMIN')
  })
})
