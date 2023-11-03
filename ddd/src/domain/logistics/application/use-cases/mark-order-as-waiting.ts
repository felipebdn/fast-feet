import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrderRespository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { OrderNotIsColectedError } from '../../../../core/errors/errors/order-not-is-colected-error'

interface MarkOrderAsWaitingUseCaseRequest {
  orderId: string
}
type MarkOrderAsWaitingUseCaseResponse = Either<
  ResourceNotFoundError | OrderNotIsColectedError,
  {
    order: Order
  }
>

export class MarkOrderAsWaitingUseCase {
  constructor(private orderRepository: OrderRespository) {}

  async execute({
    orderId,
  }: MarkOrderAsWaitingUseCaseRequest): Promise<MarkOrderAsWaitingUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (!order.deliveryId) {
      return left(new OrderNotIsColectedError())
    }

    order.availablePickup = new Date()

    return right({ order })
  }
}
