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
import {
  CreateAddressUseCase,
  CreateAddressUseCaseResponse,
} from '@/domain/logistics/application/use-cases/create-address'
import {
  CreateRecipientUseCase,
  CreateRecipientUseCaseResponse,
} from '@/domain/logistics/application/use-cases/create-recipient'
import { DeleteOrderUseCase } from '@/domain/logistics/application/use-cases/delete-order'

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
    private deleteAddress: DeleteOrderUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  @Authorize('ADMIN')
  @UsePipes(new ZodValidationPipe(createOrderBodySchema))
  async handle(@Body() body: CreateOrderBodyType) {
    let address: CreateAddressUseCaseResponse
    let recipient: CreateRecipientUseCaseResponse

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
      address = resultAddress
      if (!address.isRight()) {
        throw new Error()
      }

      const resultRecipient = await this.createRecipientUseCase.execute({
        addressId: address.value.address.id.toString(),
        name: body.name,
      })
      recipient = resultRecipient
      if (!recipient.isRight()) {
        throw new Error()
      }

      const resultOrder = await this.createOrderUseCase.execute({
        addressId: address.value.address.id.toString(),
        recipientId: recipient.value.recipient.id.toString(),
        bulk: body.bulk,
        code: body.code,
        rotule: body.rotule,
        weight: body.weight,
      })
      if (resultOrder.isLeft()) {
        throw new Error()
      }
    } catch (error) {
      if()
    }
  }
}
