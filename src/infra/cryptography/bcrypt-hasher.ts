import { hash, compare } from 'bcryptjs'
import { HashCompare } from '@/domain/logistics/application/cryptography/hash-compare'
import { HashGenerator } from '@/domain/logistics/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BcryptHasher implements HashCompare, HashGenerator {
  private HASH_SALT_LENGHT = 8

  async compare(plain: string, hash: string) {
    return compare(plain, hash)
  }

  async hash(plain: string) {
    return hash(plain, this.HASH_SALT_LENGHT)
  }
}
