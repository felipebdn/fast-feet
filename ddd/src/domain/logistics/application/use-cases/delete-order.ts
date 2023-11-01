import { Either, left, right } from '@/core/either'
import { AddressRepository } from '../repositories/address-repository'
import { OrderRespository } from '../repositories/orders-repository'
import { RecipientRepository } from '../repositories/recipient-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface DeleteOrderUseCaseRequest {
  orderId: string
}
type DeleteOrderUseCaseResponse = Either<ResourceNotFoundError, unknown>

export class DeleteOrderUseCase {
  constructor(
    private orderRespository: OrderRespository,
    private addressRepository: AddressRepository,
    private recipientRepository: RecipientRepository,
  ) {}

  async execute({
    orderId,
  }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
    const order = await this.orderRespository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const recipient = await this.recipientRepository.findById(
      order.recipientId.toString(),
    )
    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const address = await this.addressRepository.findById(
      order.addressId.toString(),
    )
    if (!address) {
      return left(new ResourceNotFoundError())
    }

    await Promise.all([
      this.addressRepository.delete(address.id.toString()),
      this.recipientRepository.delete(recipient.id.toString()),
      this.orderRespository.delete(order.id.toString()),
    ])

    return right({})
  }
}
