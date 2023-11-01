import { Order } from '../../enterprise/entities/order'
import { OrderRespository } from '../repositories/orders-repository'
import { RecipientRepository } from '../repositories/recipient-repository'
import { AddressRepository } from '../repositories/address-repository'
import { Recipient } from '../../enterprise/entities/recipient'
import { Address } from '../../enterprise/entities/address'
import { Either, left, right } from '@/core/either'
import { ValueAlreadyExistsError } from './errors/value-already-exists-error'

interface CreateOrderUseCaseRequest {
  order: {
    bulk: number
    rotule: string
    weight: number
    code: string
  }
  recipient: {
    name: string
  }
  address: {
    street: string
    complement: string
    code: string
    city: string
    state: string
    county: string
    number?: number
  }
}
type CreateOrderUseCaseResponse = Either<ValueAlreadyExistsError, unknown>

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
    const isCodeAlreadyExistsOnOrder = await this.orderRespository.findByCode(
      order.code,
    )

    if (isCodeAlreadyExistsOnOrder) {
      return left(new ValueAlreadyExistsError('code'))
    }

    const createRecipient = Recipient.create(recipient)
    await this.recipientRepository.create(createRecipient)

    const createAddress = Address.create(address)
    await this.addressRepository.create(createAddress)

    const createOrder = Order.create({
      code: order.code,
      recipientId: createRecipient.id,
      addressId: createAddress.id,
      bulk: order.bulk,
      rotule: order.rotule,
      weight: order.weight,
    })

    await this.orderRespository.create(createOrder)

    return right({})
  }
}
