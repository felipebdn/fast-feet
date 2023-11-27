import { InMemoryDeliverymanRepository } from 'test/repositories/in-memeory-deliveryman-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateUserUseCase } from './authenticate-user'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let fakeHash: FakeHasher
let fakeEncryter: FakeEncrypter
let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    fakeHash = new FakeHasher()
    fakeEncryter = new FakeEncrypter()
    sut = new AuthenticateUserUseCase(
      inMemoryDeliverymanRepository,
      fakeHash,
      fakeEncryter,
    )
  })
  it('should be able to authenticate a user', async () => {
    const deliveryman = makeDeliveryman({
      cpf: '12345678',
      password_hash: await fakeHash.hash('123456'),
      role: 'MEMBER',
    })

    inMemoryDeliverymanRepository.items.push(deliveryman)

    const result = await sut.execute({
      cpf: '12345678',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be possible to authenticate the user with wrong credentials', async () => {
    const deliveryman = makeDeliveryman({
      cpf: '12345678',
      password_hash: await fakeHash.hash('123456'),
      role: 'MEMBER',
    })

    inMemoryDeliverymanRepository.items.push(deliveryman)

    const result = await sut.execute({
      cpf: '12345678',
      password: '1234567',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
