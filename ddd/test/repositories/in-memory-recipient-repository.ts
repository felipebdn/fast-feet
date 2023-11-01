import { RecipientRepository } from '@/domain/logistics/application/repositories/recipient-repository'
import { Recipient } from '@/domain/logistics/enterprise/entities/recipient'

export class InMemoryRecipientRepository implements RecipientRepository {
  public items: Recipient[] = []

  async findById(id: string) {
    const address = this.items.find((item) => item.id.toString() === id)
    if (!address) {
      return null
    }
    return address
  }

  async create(recipient: Recipient) {
    this.items.push(recipient)
  }

  async delete(id: string) {
    const currentIndex = this.items.findIndex(
      (item) => item.id.toString() === id,
    )
    this.items.splice(currentIndex, 1)
  }
}
