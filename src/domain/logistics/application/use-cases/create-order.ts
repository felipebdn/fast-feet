import { Order } from '../../enterprise/entities/order'
import { OrderRepository } from '../repositories/orders-repository'
import { Either, left, right } from '@/core/either'
import { ValueAlreadyExistsError } from '@/core/errors/errors/value-already-exists-error'
import { Injectable } from '@nestjs/common'
import { AddressRepository } from '../repositories/address-repository'
import { RecipientRepository } from '../repositories/recipient-repository'
import { Address } from '../../enterprise/entities/address'
import { Recipient } from '../../enterprise/entities/recipient'
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
  ) {}

  async execute({
    address,
    order,
    recipient,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    let transactionId: number | undefined

    try {
      // Inicia a transação
      transactionId = Date.now()
      await this.orderRepository.createTransaction(transactionId)
      await this.addressRepository.createTransaction(transactionId)
      await this.recipientRepository.createTransaction(transactionId)

      const isCodeAlreadyExistsOnOrder = await this.orderRepository.findByCode(
        order.code,
      )

      if (isCodeAlreadyExistsOnOrder) {
        return left(new ValueAlreadyExistsError(order.code))
      }

      // create address
      const addressCreate = Address.create(address)
      await this.addressRepository.create(addressCreate, transactionId)

      // create recipient
      const recipientCreate = Recipient.create({
        addressId: addressCreate.id,
        name: recipient.name,
      })
      await this.recipientRepository.create(recipientCreate, transactionId)

      // create order
      const orderCreate = Order.create({
        addressId: addressCreate.id,
        recipientId: recipientCreate.id,
        bulk: order.bulk,
        code: order.code,
        rotule: order.rotule,
        weight: order.weight,
      })
      await this.orderRepository.create(orderCreate, transactionId)

      addressCreate.orderId = orderCreate.id
      await this.addressRepository.save(addressCreate, transactionId)
      recipientCreate.orderId = orderCreate.id
      await this.recipientRepository.save(recipientCreate, transactionId)

      // Comita a transação
      await this.orderRepository.commitTransaction(transactionId)
      await this.addressRepository.commitTransaction(transactionId)
      await this.recipientRepository.commitTransaction(transactionId)

      // Retorna os resultados
      return right({
        order: orderCreate,
        address: addressCreate,
        recipient: recipientCreate,
      })
    } catch (error) {
      // Em caso de erro, desfaz a transação
      if (transactionId) {
        await this.orderRepository.rollbackTransaction(transactionId)
        await this.addressRepository.rollbackTransaction(transactionId)
        await this.recipientRepository.rollbackTransaction(transactionId)
      }

      return left(new CreateOrderError())
    }
  }
}
