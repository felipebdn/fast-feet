import { Encrypter } from '@/domain/logistics/application/cryptography/encrypter'
import { JwtService } from '@nestjs/jwt'

export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  encrypt(payload: Record<string, unknown>) {
    return this.jwtService.signAsync(payload)
  }
}
