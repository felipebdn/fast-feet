import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { FakeHarsher } from 'test/cryptography/fake-harsher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateUserUseCase } from './authenticate-user'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let fakeHash: FakeHarsher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    fakeHash = new FakeHarsher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateUserUseCase(
      inMemoryDeliverymanRepository,
      fakeHash,
      fakeEncrypter,
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
