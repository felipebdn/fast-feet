import { Either, right } from '@/core/either'
import { OrderRespository } from '../repositories/orders-repository'
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
  constructor(private orderRespository: OrderRespository) {}

  async execute({
    amount,
    city,
    page,
    state,
  }: FetchOrderSameCityUseCaseRequest): Promise<FetchOrderSameCityUseCaseResponse> {
    const orders = await this.orderRespository.findManyByCityAndState(
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
