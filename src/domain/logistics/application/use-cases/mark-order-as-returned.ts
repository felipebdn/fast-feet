import { Either, left, right } from '@/core/either'
import { OrderRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { OrderNotIsColectedError } from '@/core/errors/errors/order-not-is-colected-error'

interface MarkOrderAsReturnedUseCaseRequest {
  orderId: string
}
type MarkOrderAsReturnedUseCaseResponse = Either<
  ResourceNotFoundError | OrderNotIsColectedError,
  unknown
>

export class MarkOrderAsReturnedUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
  }: MarkOrderAsReturnedUseCaseRequest): Promise<MarkOrderAsReturnedUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (order.status !== 'collected' || !order.deliveryId) {
      return left(new OrderNotIsColectedError())
    }

    order.isReturned()
    await this.orderRepository.save(order)

    return right({})
  }
}
