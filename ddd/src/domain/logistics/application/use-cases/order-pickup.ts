import { OrderRespository } from '../repositories/orders-repository'

interface OrderPuckupUseCaseRequest {
  orderId: string
  deliverymanId: string
}

export class OrderPuckupUseCase {
  constructor(private orderRepository: OrderRespository) {}

  execute({ deliverymanId, orderId }: OrderPuckupUseCaseRequest) {
    const order = this.orderRepository.findById(orderId)

    if (!order) {
      throw new Error('Order not found.')
    }
  }
}
