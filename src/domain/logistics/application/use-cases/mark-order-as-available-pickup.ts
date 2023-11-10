import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrderRespository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { OrderNotIsReturnedError } from './errors/order-not-returned-error'

interface MarkOrderIsAvailablePickupUseCaseRequest {
  orderId: string
}
type MarkOrderIsAvailablePickupUseCaseResponse = Either<
  ResourceNotFoundError | OrderNotIsReturnedError,
  {
    order: Order
  }
>

export class MarkOrderIsAvailablePickupUseCase {
  constructor(private orderRepository: OrderRespository) {}

  async execute({
    orderId,
  }: MarkOrderIsAvailablePickupUseCaseRequest): Promise<MarkOrderIsAvailablePickupUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (order.state !== 'returned') {
      return left(new OrderNotIsReturnedError())
    }

    order.availablePickup()

    return right({ order })
  }
}
