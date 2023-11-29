import { Recipient } from '../../enterprise/entities/recipient'

export abstract class RecipientRepository {
  abstract findById(id: string): Promise<Recipient | null>
  abstract create(recipient: Recipient): Promise<void>
  abstract save(recipient: Recipient): Promise<void>
  abstract delete(id: string): Promise<void>

  abstract createTransaction(transactionId: number): Promise<void>
  abstract commitTransaction(transactionId: number): Promise<void>
  abstract rollbackTransaction(transactionId: number): Promise<void>
}
