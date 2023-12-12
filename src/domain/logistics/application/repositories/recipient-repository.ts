import { PrismaClient } from '@prisma/client'
import { Recipient } from '../../enterprise/entities/recipient'
import * as runtime from '@prisma/client/runtime/library'

export abstract class RecipientRepository {
  abstract findById(id: string): Promise<Recipient | null>
  abstract create(
    recipient: Recipient,
    tx?: Omit<PrismaClient, runtime.ITXClientDenyList>,
  ): Promise<void>

  abstract save(
    recipient: Recipient,
    tx?: Omit<PrismaClient, runtime.ITXClientDenyList>,
  ): Promise<void>

  abstract delete(id: string): Promise<void>
}
