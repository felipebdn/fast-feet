import { Order } from '../../enterprise/entities/order'
import { OrderRespository } from '../repositories/orders-repository'

interface ListOrdersCompletedByDeliveryIdUseCaseRequest {
  deliverymanId: string
}
interface ListOrdersCompletedByDeliveryIdUseCaseResponse {
  orders: Order[]
}

export class ListOrdersCompletedByDeliveryIdUseCase {
  constructor(private orderRepository: OrderRespository) {}

  async execute({
    deliverymanId,
  }: ListOrdersCompletedByDeliveryIdUseCaseRequest): Promise<ListOrdersCompletedByDeliveryIdUseCaseResponse> {
    const orders =
      await this.orderRepository.findManyCompletedById(deliverymanId)
    return { orders }
  }
}
