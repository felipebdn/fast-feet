import { Encrypter } from '@/domain/logistics/application/cryptography/encrypter'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  async encrypt(payload: Record<string, unknown>) {
    return this.jwtService.sign(payload)
  }
}
