import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcryptjs'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

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
@UseGuards(JwtAuthGuard)
export class CreateDeliverymanController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createDeliverymanBodySchema))
  async handle(@Body() body: CreateDeliverymanBodyType) {
    const {
      name,
      cpf,
      password,
      city,
      code,
      complement,
      county,
      state,
      street,
      number,
    } = createDeliverymanBodySchema.parse(body)

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
        address: {
          create: {
            city,
            code,
            complement,
            county,
            state,
            street,
            number,
          },
        },
      },
    })
  }
}
