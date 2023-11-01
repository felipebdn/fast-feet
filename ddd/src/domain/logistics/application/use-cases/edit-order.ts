import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderRespository } from '../repositories/orders-repository'

interface EditOrderUseCaseRequest {
  orderId: string
  bulk: number
  rotule: string
  weight: number
  deliverymanId?: string
  recipientId?: string
}

export class EditOrderUseCase {
  constructor(private orderRespository: OrderRespository) {}

  async execute({
    orderId,
    bulk,
    rotule,
    weight,
    recipientId,
    deliverymanId,
  }: EditOrderUseCaseRequest): Promise<void> {
    const order = await this.orderRespository.findById(orderId)

    if (!order) {
      throw new Error('Order not found.')
    }

    order.rotule = rotule
    order.bulk = bulk
    order.weight = weight
    order.deliveryId = new UniqueEntityID(deliverymanId) ?? undefined
    order.recipientId = new UniqueEntityID(recipientId) ?? undefined

    this.orderRespository.save(order)
  }
}
