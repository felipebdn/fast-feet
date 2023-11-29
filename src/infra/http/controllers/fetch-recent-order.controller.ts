import { Controller, Get, HttpCode, Query, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchOrderSameCityUseCase } from '@/domain/logistics/application/use-cases/fetch-orders-same-city'
import { HTTPOrderPresenter } from '../presenters/http-order-presenter'

const fetchOrdersQuerySchema = z.object({
  city: z.string(),
  state: z.string(),
  page: z.coerce.number(),
  amount: z.coerce.number(),
})

type FetchOrdersQueryType = z.infer<typeof fetchOrdersQuerySchema>

@Controller('/orders')
export class FetchOrdersFromLocationController {
  constructor(private useCase: FetchOrderSameCityUseCase) {}

  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(fetchOrdersQuerySchema))
  async handle(@Query() query: FetchOrdersQueryType) {
    const { amount, city, page, state } = fetchOrdersQuerySchema.parse(query)

    const result = await this.useCase.execute({ amount, city, page, state })

    if (result.isLeft()) {
      throw new Error()
    }

    const orders = result.value.orders

    return {
      orders: orders.map(HTTPOrderPresenter.toHTTP),
    }
  }
}
