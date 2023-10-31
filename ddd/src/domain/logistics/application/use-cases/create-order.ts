import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order } from '../../enterprise/entities/order'
import { OrderRespository } from '../repositories/orders-repository'

interface CreateOrderUseCaseRequest {
  bulk: number
  recipientId: string
  rotule: string
  weight: number
}
interface CreateOrderUseCaseResponse {
  order: Order
}

export class CreateOrderUseCase {
  constructor(private orderRespository: OrderRespository) {}

  async execute({
    bulk,
    recipientId,
    rotule,
    weight,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const order = Order.create({
      bulk,
      recipientId: new UniqueEntityID(recipientId),
      rotule,
      weight,
    })

    await this.orderRespository.create(order)

    return { order }
  }
}
