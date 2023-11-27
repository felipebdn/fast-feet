import { Order } from '../../enterprise/entities/order'
import { OrderRespository } from '../repositories/orders-repository'
import { Either, left, right } from '@/core/either'
import { ValueAlreadyExistsError } from '@/core/errors/errors/value-already-exists-error'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateOrderUseCaseRequest {
  addressId: string
  recipientId: string
  bulk: number
  rotule: string
  weight: number
  code: string
}
type CreateOrderUseCaseResponse = Either<
  ValueAlreadyExistsError,
  { order: Order }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(private orderRespository: OrderRespository) {}

  async execute({
    addressId,
    bulk,
    code,
    recipientId,
    rotule,
    weight,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const isCodeAlreadyExistsOnOrder =
      await this.orderRespository.findByCode(code)

    if (isCodeAlreadyExistsOnOrder) {
      return left(new ValueAlreadyExistsError('code'))
    }

    const order = Order.create({
      code,
      recipientId: new UniqueEntityID(recipientId),
      addressId: new UniqueEntityID(addressId),
      bulk,
      rotule,
      weight,
    })

    await this.orderRespository.create(order)

    return right({ order })
  }
}
