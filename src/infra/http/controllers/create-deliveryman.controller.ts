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
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateDeliverymanUseCase } from '@/domain/logistics/application/use-cases/create-deliveryman'
import { Authorize, JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ValueAlreadyExistsError } from '@/core/errors/errors/value-already-exists-error'

const createDeliverymanBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
  role: z.enum(['ADMIN', 'MEMBER']),
})

type CreateDeliverymanBodyType = z.infer<typeof createDeliverymanBodySchema>

@Controller('/accounts/deliveryman')
@UseGuards(JwtAuthGuard)
export class CreateDeliverymanController {
  constructor(private createDeliveryman: CreateDeliverymanUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createDeliverymanBodySchema))
  @Authorize('ADMIN')
  async handle(@Body() body: CreateDeliverymanBodyType) {
    const { name, cpf, password, role } = body

    const result = await this.createDeliveryman.execute({
      cpf,
      password,
      name,
      role,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ValueAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
