import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'

@Injectable()
export class RolesGlobalGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest()

    // Verifica se o usuário tem a função MEMBER ou ADMIN
    return (
      user && (user.roles.includes('MEMBER') || user.roles.includes('ADMIN'))
    )
  }
}
