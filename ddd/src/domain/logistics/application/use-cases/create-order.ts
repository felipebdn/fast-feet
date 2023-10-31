import { Order } from '../../enterprise/entities/order'
import { OrderRespository } from '../repositories/orders-repository'
import { RecipientRepository } from '../repositories/recipient-repository'
import { AddressRepository } from '../repositories/address-repository'
import { Recipient } from '../../enterprise/entities/recipient'
import { Address } from '../../enterprise/entities/address'

interface CreateOrderUseCaseRequest {
  order: {
    bulk: number
    rotule: string
    weight: number
  }
  recipient: {
    name: string
  }
  address: {
    road: string
    complement: string
    code: string
    city: string
    state: string
    sector: string
    number?: number
  }
}
interface CreateOrderUseCaseResponse {
  order: Order
  recipient: Recipient
  address: Address
}

export class CreateOrderUseCase {
  constructor(
    private orderRespository: OrderRespository,
    private recipientRepository: RecipientRepository,
    private addressRepository: AddressRepository,
  ) {}

  async execute({
    address,
    order,
    recipient,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const createRecipient = Recipient.create(recipient)
    await this.recipientRepository.create(createRecipient)

    const createAddress = Address.create(address)
    await this.addressRepository.create(createAddress)

    const createOrder = Order.create({
      recipientId: createRecipient.id,
      addressId: createAddress.id,
      bulk: order.bulk,
      rotule: order.rotule,
      weight: order.weight,
    })

    await this.orderRespository.create(createOrder)

    return {
      order: createOrder,
      recipient: createRecipient,
      address: createAddress,
    }
  }
}
