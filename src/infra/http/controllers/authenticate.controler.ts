import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { AuthenticateUserUseCase } from '@/domain/logistics/application/use-cases/authenticate-user'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { WrongCredentialsError } from '@/domain/logistics/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'

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
  @Public()
  async handle(@Body() body: AuthenticateBodyType) {
    const { cpf, password } = authenticateBodySchema.parse(body)

    const result = await this.authenticate.execute({ cpf, password })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
