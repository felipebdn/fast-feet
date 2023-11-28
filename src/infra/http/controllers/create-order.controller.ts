import { CreateOrderUseCase } from '@/domain/logistics/application/use-cases/create-order'
import { Authorize, JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateAddressUseCase } from '@/domain/logistics/application/use-cases/create-address'
import { CreateRecipientUseCase } from '@/domain/logistics/application/use-cases/create-recipient'
import { Address } from '@/domain/logistics/enterprise/entities/address'
import { Recipient } from '@/domain/logistics/enterprise/entities/recipient'

const createOrderBodySchema = z.object({
  name: z.string(),
  street: z.string(),
  complement: z.string(),
  zipCode: z.string(),
  city: z.string(),
  state: z.string(),
  county: z.string(),
  number: z.number().optional(),
  bulk: z.number(),
  rotule: z.string(),
  weight: z.number(),
  code: z.string(),
})

type CreateOrderBodyType = z.infer<typeof createOrderBodySchema>

@Controller('/orders')
@UseGuards(JwtAuthGuard)
export class CreateOrderController {
  constructor(
    private createOrderUseCase: CreateOrderUseCase,
    private createAddressUseCase: CreateAddressUseCase,
    private createRecipientUseCase: CreateRecipientUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @Authorize('ADMIN')
  @UsePipes(new ZodValidationPipe(createOrderBodySchema))
  async handle(@Body() body: CreateOrderBodyType) {
    let address: Address
    let recipient: Recipient

    try {
      const resultAddress = await this.createAddressUseCase.execute({
        city: body.city,
        code: body.zipCode,
        complement: body.complement,
        county: body.county,
        state: body.state,
        street: body.street,
        number: body.number,
      })
      if (resultAddress.isRight()) {
        address = resultAddress.value.address
      }
      const resultRecipient = await this.createRecipientUseCase.execute({})
    } catch (error) {}
  }
}
