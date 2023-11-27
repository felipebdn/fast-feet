import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Put,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ChangePasswordUseCase } from '@/domain/logistics/application/use-cases/change-password'
import { Authorize } from '@/infra/auth/jwt-auth.guard'
import { PasswordAlreadyUsedError } from '@/domain/logistics/application/use-cases/errors/password-already-used-error'

const changePasswordBodySchema = z.object({
  deliverymanId: z.string(),
  password: z.string(),
})

type ChangePasswordBodySchema = z.infer<typeof changePasswordBodySchema>

@Controller('/sessions/reset')
export class AuthenticateController {
  constructor(private changePassword: ChangePasswordUseCase) {}

  @Put()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(changePasswordBodySchema))
  @Authorize('ADMIN')
  async handle(@Body() body: ChangePasswordBodySchema) {
    const { deliverymanId, password } = changePasswordBodySchema.parse(body)

    const result = await this.changePassword.execute({
      deliverymanId,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case PasswordAlreadyUsedError:
          throw new ForbiddenException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
