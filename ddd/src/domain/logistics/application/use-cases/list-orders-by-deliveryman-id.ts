import { Order } from '../../enterprise/entities/order'
import { OrderRespository } from '../repositories/orders-repository'

interface ListOrdersByDeliveryIdUseCaseRequest {
  deliverymanId: string
  page: number
  amount: number
}
interface ListOrdersByDeliveryIdUseCaseResponse {
  orders: Order[]
}

export class ListOrdersByDeliveryIdUseCase {
  constructor(private orderRepository: OrderRespository) {}

  async execute({
    amount,
    deliverymanId,
    page,
  }: ListOrdersByDeliveryIdUseCaseRequest): Promise<ListOrdersByDeliveryIdUseCaseResponse> {
    const orders = await this.orderRepository.findManyById(deliverymanId, {
      amount,
      page,
    })
    return { orders }
  }
}
