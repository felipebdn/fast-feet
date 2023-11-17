import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest()

    // Verifica se o usuário tem a função ADMIN
    return user && user.roles.includes('ADMIN')
  }
}
