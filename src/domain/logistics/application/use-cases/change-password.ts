import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { PasswordAlreadyUsedError } from './errors/password-already-used-error'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'
import { HashCompare } from '../cryptography/hash-compare'

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
  constructor(
    private deliverymanRepository: DeliverymanRepository,
    private hashCompare: HashCompare,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    password,
    deliverymanId,
  }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    const isMatchPassword = await this.hashCompare.compare(
      password,
      deliveryman.password_hash,
    )

    if (isMatchPassword) {
      return left(new PasswordAlreadyUsedError())
    }

    deliveryman.password_hash = await this.hashGenerator.hash(password)

    await this.deliverymanRepository.save(deliveryman)

    return right({})
  }
}
