import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { PasswordAlreadyUsedError } from './errors/password-already-used-error'
import { Injectable } from '@nestjs/common'

interface ChangePasswordUseCaseRequest {
  deliverymanId: string
  password: string
}
type ChangePasswordUseCaseResponse = Either<
  ResourceNotFoundError | PasswordAlreadyUsedError,
  unknown
>

@Injectable()
export class ChangePasswordUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    password,
    deliverymanId,
  }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    if (deliveryman.hash_password === password) {
      return left(new PasswordAlreadyUsedError())
    }

    deliveryman.hash_password = password

    await this.deliverymanRepository.save(deliveryman)

    return right({})
  }
}
