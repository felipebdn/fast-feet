import { Module } from '@nestjs/common'

import { Encrypter } from '@/domain/logistics/application/cryptography/encrypter'
import { HashCompare } from '@/domain/logistics/application/cryptography/hash-compare'
import { HashGenerator } from '@/domain/logistics/application/cryptography/hash-generator'

import { BcryptHarsher } from './bcrypt-harsher'
import { JwtEncrypter } from './jwt-encrypter'

@Module({
  providers: [
    { provide: HashCompare, useClass: BcryptHarsher },
    { provide: HashGenerator, useClass: BcryptHarsher },
    { provide: Encrypter, useClass: JwtEncrypter },
  ],
  exports: [Encrypter, HashGenerator, HashCompare],
})
export class CryptographyModule {}
