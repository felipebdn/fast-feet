import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common'

export const Roles = (...roles: string[]) => SetMetadata('roles', roles)

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    return request.user
  },
)

export const Admin = () => Roles('ADMIN')
