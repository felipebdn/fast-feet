import {
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  applyDecorators,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Role } from '@prisma/client'
import { UserPayload } from './jwt.strategy'
import { IS_PUBLIC_KEY } from './public'

export const ROLES_KEY = 'roles'
export function Authorize(...roles: Role[]): MethodDecorator {
  return applyDecorators(SetMetadata(ROLES_KEY, roles))
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    await super.canActivate(context)

    const { user } = context.switchToHttp().getRequest()

    const payload = user as UserPayload

    const declaredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (
      (!declaredRoles && payload.role === 'MEMBER') ||
      (!declaredRoles && payload.role === 'ADMIN')
    ) {
      return true
    }

    if (declaredRoles && !declaredRoles.includes(payload.role)) {
      throw new UnauthorizedException('Unauthorized access')
    }

    return true
  }
}
