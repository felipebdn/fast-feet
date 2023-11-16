import { hash, compare } from 'bcryptjs'
import { HashCompare } from '@/domain/logistics/application/cryptography/hash-compare'
import { HashGenerator } from '@/domain/logistics/application/cryptography/hash-generator'

export class BcryptHasher implements HashCompare, HashGenerator {
  compare(plain: string, hash: string) {
    return compare(plain, hash)
  }

  hash(plain: string) {
    return hash(plain, 8)
  }
}
