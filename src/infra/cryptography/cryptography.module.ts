import { Module } from '@nestjs/common'

import { Encrypter } from '@/domain/logistics/application/cryptography/encrypter'
import { HashCompare } from '@/domain/logistics/application/cryptography/hash-compare'
import { HashGenerator } from '@/domain/logistics/application/cryptography/hash-generator'

import { BcryptHasher } from './bcrypt-hasher'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  providers: [
    { provide: HashCompare, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: Encrypter, useClass: JwtEncrypter },
  ],
  exports: [Encrypter, HashGenerator, HashCompare],
})
export class CryptographyModule {}
