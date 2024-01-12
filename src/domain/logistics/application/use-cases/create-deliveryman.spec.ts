import { FakeHarsher } from 'test/cryptography/fake-harsher'
import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { InMemoryTransactionScope } from 'test/transactions/in-memory-transaction-scope'

import { CreateDeliverymanUseCase } from './create-deliveryman'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let inMemoryTransactionScope: InMemoryTransactionScope
let fakeHarsher: FakeHarsher
let sut: CreateDeliverymanUseCase

describe('Create Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    inMemoryTransactionScope = new InMemoryTransactionScope()
    fakeHarsher = new FakeHarsher()
    sut = new CreateDeliverymanUseCase(
      inMemoryDeliverymanRepository,
      fakeHarsher,
      inMemoryTransactionScope,
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

    const hashedPassword = await fakeHarsher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0].password_hash).toBe(
      hashedPassword,
    )
  })
})
