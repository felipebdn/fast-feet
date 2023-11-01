import { Order } from '../../enterprise/entities/order'
import { OrderRespository } from '../repositories/orders-repository'

interface MarkOrderAsWaitingUseCaseRequest {
  orderId: string
}
interface MarkOrderAsWaitingUseCaseResponse {
  order: Order
}

export class MarkOrderAsWaitingUseCase {
  constructor(private orderRepository: OrderRespository) {}

  async execute({
    orderId,
  }: MarkOrderAsWaitingUseCaseRequest): Promise<MarkOrderAsWaitingUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      throw new Error('Order not found.')
    }

    if (!order.deliveryId) {
      throw new Error('Order not is colected.')
    }

    order.availablePickup = new Date()

    return { order }
  }
}
