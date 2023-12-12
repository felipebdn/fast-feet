import { PrismaClient } from '@prisma/client'
import { Address } from '../../enterprise/entities/address'
import * as runtime from '@prisma/client/runtime/library'

export abstract class AddressRepository {
  abstract findById(id: string): Promise<Address | null>
  abstract findManyByCityAndState(
    city: string,
    state: string,
  ): Promise<Address[]>

  abstract create(
    address: Address,
    tx?: Omit<PrismaClient, runtime.ITXClientDenyList>,
  ): Promise<void>

  abstract save(
    address: Address,
    tx?: Omit<PrismaClient, runtime.ITXClientDenyList>,
  ): Promise<void>

  abstract delete(id: string): Promise<void>
}
