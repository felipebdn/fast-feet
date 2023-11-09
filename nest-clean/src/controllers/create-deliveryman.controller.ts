import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

const createDeliverymanBodySchema = z.object({
  addressId: z.string(),
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
})

type CreateDeliverymanBodyType = z.infer<typeof createDeliverymanBodySchema>

@Controller('/accounts/deliveryman')
export class CreateDeliverymanController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createDeliverymanBodySchema))
  async handle(@Body() body: CreateDeliverymanBodyType) {
    const { addressId, name, cpf, password } =
      createDeliverymanBodySchema.parse(body)

    const deliverymanWithSameCpf = await this.prisma.deliveryman.findUnique({
      where: {
        cpf,
      },
    })

    if (deliverymanWithSameCpf) {
      throw new ConflictException('Deliveryman with same CPF already existis.')
    }

    const hashPassword = await hash(password, 8)

    await this.prisma.deliveryman.create({
      data: {
        cpf,
        name,
        password_hash: hashPassword,
        addressId,
      },
    })
  }
}
