import { Recipient } from '../../enterprise/entities/recipient'

export abstract class RecipientRepository {
  abstract findById(id: string): Promise<Recipient | null>
  abstract create(recipient: Recipient, transactionId?: number): Promise<void>
  abstract save(recipient: Recipient, transactionId?: number): Promise<void>
  abstract delete(id: string, transactionId?: number): Promise<void>

  abstract createTransaction(transactionId: number): Promise<void>
  abstract commitTransaction(transactionId: number): Promise<void>
  abstract rollbackTransaction(transactionId: number): Promise<void>
}
