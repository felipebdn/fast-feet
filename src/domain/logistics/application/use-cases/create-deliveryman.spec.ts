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
    expect(result.value).toEqual({
      deliveryman: inMemoryDeliverymanRepository.items[0],
    })
  })

  it('should hash student password upon registration', async () => {
    const result = await sut.execute({
      cpf: '000.000.000-41',
      password: '123456',
      name: 'deliveryman name',
      role: 'ADMIN',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0].password_hash).toBe(
      hashedPassword,
    )
  })
})
