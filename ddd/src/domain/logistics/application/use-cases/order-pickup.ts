import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderRespository } from '../repositories/orders-repository'
import { Either, left, right } from '@/core/either'
import { ObjectAlreadyResponsibleDeliveryman } from './errors/object-already-responsible-deliveryman-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface OrderPuckupUseCaseRequest {
  orderId: string
  deliverymanId: string
}

type OrderPuckupUseCaseResponse = Either<
  ResourceNotFoundError | ObjectAlreadyResponsibleDeliveryman,
  unknown
>

export class OrderPuckupUseCase {
  constructor(private orderRepository: OrderRespository) {}

  async execute({
    deliverymanId,
    orderId,
  }: OrderPuckupUseCaseRequest): Promise<OrderPuckupUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (order.deliveryId) {
      return left(new ObjectAlreadyResponsibleDeliveryman())
    }

    order.deliveryId = new UniqueEntityID(deliverymanId)
    await this.orderRepository.save(order)

    return right({})
  }
}
