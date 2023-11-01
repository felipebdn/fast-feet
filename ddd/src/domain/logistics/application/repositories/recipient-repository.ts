import { Recipient } from '../../enterprise/entities/recipient'

export interface RecipientRepository {
  findById(id: string): Promise<Recipient | null>
  create(recipient: Recipient): Promise<void>
  save(recipient: Recipient): Promise<void>
  delete(id: string): Promise<void>
}
