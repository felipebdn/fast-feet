import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AuthenticateUserUseCase } from '@/domain/logistics/application/use-cases/authenticate-user'

const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

type AuthenticateBodyType = z.infer<typeof authenticateBodySchema>

@Controller('/sessions/login')
export class AuthenticateController {
  constructor(private authenticate: AuthenticateUserUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodyType) {
    const { cpf, password } = authenticateBodySchema.parse(body)

    const result = await this.authenticate.execute({ cpf, password })

    if (result.isLeft()) {
      throw new Error()
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
