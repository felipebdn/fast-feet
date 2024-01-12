import { Either, left, right } from '@/core/either'
import { OrderNotIsColectedError } from '@/core/errors/errors/order-not-is-colected-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { OrderRepository } from '../repositories/orders-repository'

interface MarkObjectAsDeliveredUseCaseRequest {
  orderId: string
}
type MarkObjectAsDeliveredUseCaseResponse = Either<
  ResourceNotFoundError | OrderNotIsColectedError,
  unknown
>

export class MarkObjectAsDeliveredUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
  }: MarkObjectAsDeliveredUseCaseRequest): Promise<MarkObjectAsDeliveredUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (order.status !== 'collected' || !order.deliveryId) {
      return left(new OrderNotIsColectedError())
    }

    order.isDelivered()

    await this.orderRepository.save(order)

    return right({})
  }
}
