import { Order } from '../../enterprise/entities/order'
import { OrderRespository } from '../repositories/orders-repository'

interface ListOrdersPendingByDeliveryIdUseCaseRequest {
  deliverymanId: string
}
interface ListOrdersPendingByDeliveryIdUseCaseResponse {
  orders: Order[]
}

export class ListOrdersPendingByDeliveryIdUseCase {
  constructor(private orderRepository: OrderRespository) {}

  async execute({
    deliverymanId,
  }: ListOrdersPendingByDeliveryIdUseCaseRequest): Promise<ListOrdersPendingByDeliveryIdUseCaseResponse> {
    const orders = await this.orderRepository.findManyPendingById(deliverymanId)
    return { orders }
  }
}
