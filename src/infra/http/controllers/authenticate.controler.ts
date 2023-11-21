import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { AuthenticateUserUseCase } from '@/domain/logistics/application/use-cases/authenticate-user'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
  isAdmin: z.boolean(),
})

type AuthenticateBodyType = z.infer<typeof authenticateBodySchema>

@Controller('/sessions/login')
export class AuthenticateController {
  constructor(private authenticate: AuthenticateUserUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodyType) {
    const { cpf, password, isAdmin } = authenticateBodySchema.parse(body)

    const result = await this.authenticate.execute({ cpf, password, isAdmin })

    if (result.isLeft()) {
      throw new Error()
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
