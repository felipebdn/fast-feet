import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderRespository } from '../repositories/orders-repository'

interface OrderPuckupUseCaseRequest {
  orderId: string
  deliverymanId: string
}

export class OrderPuckupUseCase {
  constructor(private orderRepository: OrderRespository) {}

  async execute({ deliverymanId, orderId }: OrderPuckupUseCaseRequest) {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      throw new Error('Order not found.')
    }

    if (order.deliveryId) {
      throw new Error('Object already has a responsible delivery person')
    }

    order.deliveryId = new UniqueEntityID(deliverymanId)
  }
}
