import { Recipient } from '../../enterprise/entities/recipient'

export abstract class RecipientRepository {
  abstract findById(id: string): Promise<Recipient | null>
  abstract create(recipient: Recipient, transactionKey?: string): Promise<void>
  abstract save(recipient: Recipient): Promise<void>
  abstract delete(id: string): Promise<void>
}
