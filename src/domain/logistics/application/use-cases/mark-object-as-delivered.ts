import { Either, left, right } from '@/core/either'
import { OrderRespository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { OrderNotIsColectedError } from '@/core/errors/errors/order-not-is-colected-error'

interface MarkObjectAsDeliveredUseCaseRequest {
  orderId: string
}
type MarkObjectAsDeliveredUseCaseResponse = Either<
  ResourceNotFoundError | OrderNotIsColectedError,
  unknown
>

export class MarkObjectAsDeliveredUseCase {
  constructor(private orderRepository: OrderRespository) {}

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
