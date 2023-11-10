import {
  Controller,
  Get,
  HttpCode,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'

const fetchOrdersQuerySchema = z.object({
  city: z.string(),
  state: z.string(),
  page: z.coerce.number(),
  amount: z.coerce.number(),
})

type FetchOrdersQueryType = z.infer<typeof fetchOrdersQuerySchema>

@Controller('/orders')
@UseGuards(JwtAuthGuard)
export class FetchOrdersFromLocationController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(fetchOrdersQuerySchema))
  async handle(@Query() query: FetchOrdersQueryType) {
    const { amount, city, page, state } = fetchOrdersQuerySchema.parse(query)

    const orders = await this.prisma.order.findMany({
      where: {
        address: {
          city,
          state,
        },
      },
      take: amount,
      skip: (page - 1) * amount,
    })

    return {
      orders,
    }
  }
}
