import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateDeliverymanUseCase } from '@/domain/logistics/application/use-cases/create-deliveryman'
import { AdminGuard } from '@/infra/auth/admin.guard'

const createDeliverymanBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
  city: z.string(),
  code: z.string(),
  complement: z.string().optional(),
  county: z.string(),
  state: z.string(),
  street: z.string(),
  number: z.coerce.number().optional(),
})

type CreateDeliverymanBodyType = z.infer<typeof createDeliverymanBodySchema>

@Controller('/accounts/deliveryman')
export class CreateDeliverymanController {
  constructor(private createDeliveryman: CreateDeliverymanUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createDeliverymanBodySchema))
  @UseGuards(AdminGuard)
  async handle(@Body() body: CreateDeliverymanBodyType) {
    const { name, cpf, password } = createDeliverymanBodySchema.parse(body)

    const result = await this.createDeliveryman.execute({
      cpf,
      password,
      name,
    })

    if (result.isLeft()) {
      throw new Error()
    }
  }
}
