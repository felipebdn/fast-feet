import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderRespository } from '../repositories/orders-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditOrderUseCaseRequest {
  orderId: string
  bulk: number
  rotule: string
  weight: number
  deliverymanId?: string
  recipientId?: string
}

type EditOrderUseCaseResponse = Either<ResourceNotFoundError, unknown>

export class EditOrderUseCase {
  constructor(private orderRespository: OrderRespository) {}

  async execute({
    orderId,
    bulk,
    rotule,
    weight,
    recipientId,
    deliverymanId,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.orderRespository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.rotule = rotule
    order.bulk = bulk
    order.weight = weight
    order.deliveryId = new UniqueEntityID(deliverymanId) ?? undefined
    order.recipientId = new UniqueEntityID(recipientId) ?? undefined

    this.orderRespository.save(order)

    return right({})
  }
}
