import { InMemoryDeliverymanRepository } from 'test/repositories/in-memeory-deliveryman-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { AuthenticateUserUseCase } from './authenticate-user'
import { JwtService } from '@nestjs/jwt'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let fakeHash: FakeHasher
let fakeEncryter: FakeEncrypter
let sut: AuthenticateUserUseCase
let jwtService: JwtService

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
      hash_password: await fakeHash.hash('123456'),
      role: 'MEMBER',
    })

    await inMemoryDeliverymanRepository.items.push(deliveryman)

    const result = await sut.execute({
      cpf: '12345678',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
