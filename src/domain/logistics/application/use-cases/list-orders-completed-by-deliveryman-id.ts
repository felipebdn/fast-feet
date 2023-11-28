import { Either, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'
import { OrderRepository } from '../repositories/orders-repository'

interface ListOrdersCompletedByDeliveryIdUseCaseRequest {
  deliverymanId: string
}
type ListOrdersCompletedByDeliveryIdUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>
export class ListOrdersCompletedByDeliveryIdUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    deliverymanId,
  }: ListOrdersCompletedByDeliveryIdUseCaseRequest): Promise<ListOrdersCompletedByDeliveryIdUseCaseResponse> {
    const orders =
      await this.orderRepository.findManyCompletedById(deliverymanId)
    return right({ orders })
  }
}
