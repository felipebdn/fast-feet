import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { DeliverymanRepository } from '../repositories/deliveryman-repository'

interface DeleteDeliverymanUseCaseRequest {
  deliverymanId: string
}
type DeleteDeliverymanUseCaseResponse = Either<ResourceNotFoundError, unknown>

@Injectable()
export class DeleteDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    deliverymanId,
  }: DeleteDeliverymanUseCaseRequest): Promise<DeleteDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    await this.deliverymanRepository.delete(deliverymanId)

    return right({})
  }
}
