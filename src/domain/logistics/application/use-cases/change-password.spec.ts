import { InMemoryDeliverymanRepository } from 'test/repositories/in-memeory-deliveryman-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { ChangePasswordUseCase } from './change-password'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { PasswordAlreadyUsedError } from './errors/password-already-used-error'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let sut: ChangePasswordUseCase

describe('Change Password', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    sut = new ChangePasswordUseCase(inMemoryDeliverymanRepository)
  })
  it('should be able to change password of deliveryman', async () => {
    const deliveryman = makeDeliveryman({
      hash_password: 'password-01',
    })

    await inMemoryDeliverymanRepository.create(deliveryman)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      password: 'password-02',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0].hash_password).toEqual(
      'password-02',
    )
  })

  it('should not be able to change the password because this deliveryman not exist', async () => {
    const deliveryman = makeDeliveryman({
      hash_password: 'password-01',
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
      hash_password: 'password-01',
    })
    await inMemoryDeliverymanRepository.create(deliveryman)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      password: 'password-01',
    })

    expect(result.isLeft()).toBe(true)
    expect(inMemoryDeliverymanRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(PasswordAlreadyUsedError)
  })
})
