import { CreateOrderUseCase } from '@/domain/logistics/application/use-cases/create-order'
import { Authorize, JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ValueAlreadyExistsError } from '@/core/errors/errors/value-already-exists-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

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
  constructor(private createOrderUseCase: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  @Authorize('ADMIN')
  @UsePipes(new ZodValidationPipe(createOrderBodySchema))
  async handle(@Body() body: CreateOrderBodyType) {
    const resultOrder = await this.createOrderUseCase.execute({
      address: {
        city: body.city,
        code: body.zipCode,
        complement: body.complement,
        county: body.county,
        state: body.state,
        street: body.street,
        number: body.number,
      },
      order: {
        bulk: body.bulk,
        code: body.code,
        rotule: body.rotule,
        weight: body.weight,
      },
      recipient: {
        name: body.name,
      },
    })

    if (resultOrder.isLeft()) {
      const error = resultOrder.value

      switch (error.constructor) {
        case ValueAlreadyExistsError:
          throw new ConflictException(error.message)
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
