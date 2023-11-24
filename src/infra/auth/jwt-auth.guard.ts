import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler())

    if (!roles) {
      return true // Se não houver restrições de função, permita o acesso (membros padrão)
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user || !user.role) {
      throw new UnauthorizedException('Unauthorized access.')
    }

    return roles.includes(user.role)
  }
}
