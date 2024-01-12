import { Injectable } from '@nestjs/common'
import { randomUUID } from 'crypto'

import { Either, left, right } from '@/core/either'
import { ValueAlreadyExistsError } from '@/core/errors/errors/value-already-exists-error'

import { Address } from '../../enterprise/entities/address'
import { Order } from '../../enterprise/entities/order'
import { Recipient } from '../../enterprise/entities/recipient'
import { AddressRepository } from '../repositories/address-repository'
import { OrderRepository } from '../repositories/orders-repository'
import { RecipientRepository } from '../repositories/recipient-repository'
import { TransactionScope } from '../transaction/transaction-scope'
import { CreateOrderError } from './errors/create-order-error'

interface CreateOrderUseCaseRequest {
  address: {
    street: string
    complement: string
    code: string
    city: string
    state: string
    county: string
    number?: number
  }
  recipient: {
    name: string
  }
  order: {
    bulk: number
    rotule: string
    weight: number
    code: string
  }
}
type CreateOrderUseCaseResponse = Either<
  ValueAlreadyExistsError | CreateOrderError,
  { order: Order; address: Address; recipient: Recipient }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private addressRepository: AddressRepository,
    private recipientRepository: RecipientRepository,
    private transactionScope: TransactionScope,
  ) {}

  async execute({
    address,
    order,
    recipient,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const isCodeAlreadyExistsOnOrder = await this.orderRepository.findByCode(
      order.code,
    )

    if (isCodeAlreadyExistsOnOrder) {
      return left(new ValueAlreadyExistsError(order.code))
    }

    // create address
    const addressCreate = Address.create(address)

    // create recipient
    const recipientCreate = Recipient.create({
      addressId: addressCreate.id,
      name: recipient.name,
    })

    // create order
    const orderCreate = Order.create({
      addressId: addressCreate.id,
      recipientId: recipientCreate.id,
      bulk: order.bulk,
      code: order.code,
      rotule: order.rotule,
      weight: order.weight,
    })

    addressCreate.orderId = orderCreate.id
    recipientCreate.orderId = orderCreate.id

    const transactionKey = randomUUID()

    await this.transactionScope.run(async () => {
      await this.addressRepository.create(addressCreate, transactionKey)
      await this.recipientRepository.create(recipientCreate, transactionKey)
      await this.orderRepository.create(orderCreate, transactionKey)
    }, transactionKey)

    return right({
      order: orderCreate,
      address: addressCreate,
      recipient: recipientCreate,
    })
  }
}
