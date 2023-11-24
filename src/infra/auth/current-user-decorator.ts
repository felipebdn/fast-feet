import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common'
import { UserPayload } from './jwt.strategy'

export const Roles = (...roles: string[]) => SetMetadata('roles', roles)
export const Admin = () => Roles('ADMIN')

export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    return request.user as UserPayload
  },
)
