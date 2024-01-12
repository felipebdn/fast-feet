import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { Order } from '../../enterprise/entities/order'
import { OrderRepository } from '../repositories/orders-repository'

interface FetchOrderSameCityUseCaseRequest {
  city: string
  state: string
  amount: number
  page: number
}

type FetchOrderSameCityUseCaseResponse = Either<null, { orders: Order[] }>

@Injectable()
export class FetchOrderSameCityUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    amount,
    city,
    page,
    state,
  }: FetchOrderSameCityUseCaseRequest): Promise<FetchOrderSameCityUseCaseResponse> {
    const orders = await this.orderRepository.findManyByCityAndState(
      city,
      state,
      {
        amount,
        page,
      },
    )
    return right({ orders })
  }
}
