import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ObjectAlreadyResponsibleDeliveryman } from '@/core/errors/errors/object-already-responsible-deliveryman-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { OrderRepository } from '../repositories/orders-repository'

interface OrderPuckupUseCaseRequest {
  orderId: string
  deliverymanId: string
}

type OrderPuckupUseCaseResponse = Either<
  ResourceNotFoundError | ObjectAlreadyResponsibleDeliveryman,
  unknown
>

export class OrderPuckupUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    deliverymanId,
    orderId,
  }: OrderPuckupUseCaseRequest): Promise<OrderPuckupUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (
      order.deliveryId?.toString() !== deliverymanId &&
      order.status === 'collected'
    ) {
      return left(new ObjectAlreadyResponsibleDeliveryman())
    }

    order.isCollected(new UniqueEntityID(deliverymanId))

    await this.orderRepository.save(order)

    return right({})
  }
}
