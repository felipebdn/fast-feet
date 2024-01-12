import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { OrderRepository } from '../repositories/orders-repository'

interface EditOrderUseCaseRequest {
  orderId: string
  bulk: number
  rotule: string
  weight: number
  deliverymanId?: string
  recipientId?: string
}

type EditOrderUseCaseResponse = Either<ResourceNotFoundError, unknown>

export class EditOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
    bulk,
    rotule,
    weight,
    recipientId,
    deliverymanId,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.rotule = rotule
    order.bulk = bulk
    order.weight = weight
    order.deliveryId = new UniqueEntityID(deliverymanId) ?? undefined
    order.recipientId = new UniqueEntityID(recipientId) ?? undefined

    this.orderRepository.save(order)

    return right({})
  }
}
