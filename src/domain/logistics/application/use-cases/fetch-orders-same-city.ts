import { Either, right } from '@/core/either'
import { OrderRepository } from '../repositories/orders-repository'
import { Order } from '../../enterprise/entities/order'
import { Injectable } from '@nestjs/common'

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
