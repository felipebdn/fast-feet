import { AddressRepository } from '../repositories/address-repository'
import { OrderRespository } from '../repositories/orders-repository'
import { RecipientRepository } from '../repositories/recipient-repository'

interface DeleteOrderUseCaseRequest {
  orderId: string
}
// type DeleteOrderUseCaseResponse = {}

export class DeleteOrderUseCase {
  constructor(
    private orderRespository: OrderRespository,
    private addressRepository: AddressRepository,
    private recipientRepository: RecipientRepository,
  ) {}

  async execute({ orderId }: DeleteOrderUseCaseRequest): Promise<void> {
    const order = await this.orderRespository.findById(orderId)

    if (!order) {
      throw new Error('Order not found.')
    }

    const recipient = await this.recipientRepository.findById(
      order.recipientId.toString(),
    )
    if (!recipient) {
      throw new Error('Recipient not found.')
    }

    const address = await this.addressRepository.findById(
      order.addressId.toString(),
    )
    if (!address) {
      throw new Error('Address not found.')
    }

    await Promise.all([
      this.addressRepository.delete(address.id.toString()),
      this.recipientRepository.delete(recipient.id.toString()),
      this.orderRespository.delete(order.id.toString()),
    ])
  }
}
