import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'

import { HashCompare } from '@/domain/logistics/application/cryptography/hash-compare'
import { HashGenerator } from '@/domain/logistics/application/cryptography/hash-generator'

@Injectable()
export class BcryptHarsher implements HashCompare, HashGenerator {
  private HASH_SALT_LENGTH = 8

  async compare(plain: string, hash: string) {
    return compare(plain, hash)
  }

  async hash(plain: string) {
    return hash(plain, this.HASH_SALT_LENGTH)
  }
}
