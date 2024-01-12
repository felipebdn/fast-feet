import { FakeHarsher } from 'test/cryptography/fake-harsher'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { ChangePasswordUseCase } from './change-password'
import { PasswordAlreadyUsedError } from './errors/password-already-used-error'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let fakeHarsher: FakeHarsher
let sut: ChangePasswordUseCase

describe('Change Password', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    fakeHarsher = new FakeHarsher()
    sut = new ChangePasswordUseCase(
      inMemoryDeliverymanRepository,
      fakeHarsher,
      fakeHarsher,
    )
  })
  it('should be able to change password of deliveryman', async () => {
    const deliveryman = makeDeliveryman({
      password_hash: await fakeHarsher.hash('123456'),
    })

    inMemoryDeliverymanRepository.items.push(deliveryman)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      password: 'password-02',
    })

    const hashPassword = await fakeHarsher.hash('password-02')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0].password_hash).toEqual(
      hashPassword,
    )
  })

  it('should not be able to change the password because this deliveryman not exist', async () => {
    const deliveryman = makeDeliveryman({
      password_hash: 'password-01',
    })

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      password: 'password-02',
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryDeliverymanRepository.items).toHaveLength(0)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to change the password because the password has already been used before', async () => {
    const deliveryman = makeDeliveryman({
      password_hash: await fakeHarsher.hash('123456'),
    })
    await inMemoryDeliverymanRepository.create(deliveryman)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryDeliverymanRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(PasswordAlreadyUsedError)
  })
})
