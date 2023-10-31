import { RecipientRepository } from '@/domain/logistics/application/repositories/recipient-repository'
import { Recipient } from '@/domain/logistics/enterprise/entities/recipient'

export class InMemoryRecipientRepository implements RecipientRepository {
  public items: Recipient[] = []

  async create(recipient: Recipient) {
    this.items.push(recipient)
  }
}
