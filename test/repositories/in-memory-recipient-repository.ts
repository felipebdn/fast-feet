import { RecipientRepository } from '@/domain/logistics/application/repositories/recipient-repository'
import { Recipient } from '@/domain/logistics/enterprise/entities/recipient'

export class InMemoryRecipientRepository implements RecipientRepository {
  private transactions: Map<number, Recipient[]> = new Map()
  public items: Recipient[] = []

  async findById(id: string) {
    const address = this.items.find((item) => item.id.toString() === id)
    if (!address) {
      return null
    }
    return address
  }

  async create(recipient: Recipient, transactionId?: number) {
    if (transactionId !== undefined) {
      if (!this.transactions.has(transactionId)) {
        this.transactions.set(transactionId, [])
      }
      const transactionsArray = this.transactions.get(transactionId)
      if (transactionsArray) {
        transactionsArray.push(recipient)
      }
    } else {
      this.items.push(recipient)
    }
  }

  async save(recipient: Recipient, transactionId?: number) {
    if (transactionId !== undefined) {
      const transactionsArray = this.transactions.get(transactionId)
      if (transactionsArray) {
        const findIndex = this.items.findIndex(
          (item) => item.id === recipient.id,
        )
        transactionsArray[findIndex] = recipient
      }
    } else {
      const findIndex = this.items.findIndex((item) => item.id === recipient.id)
      this.items[findIndex] = recipient
    }
  }

  async delete(id: string, transactionId?: number) {
    if (transactionId !== undefined) {
      const transactionsArray = this.transactions.get(transactionId)
      if (transactionsArray) {
        const currentIndex = transactionsArray.findIndex(
          (item) => item.id.toString() === id,
        )
        transactionsArray.splice(currentIndex, 1)
      }
    } else {
      const currentIndex = this.items.findIndex(
        (item) => item.id.toString() === id,
      )
      this.items.splice(currentIndex, 1)
    }
  }

  async createTransaction(transactionId: number): Promise<void> {
    if (!this.transactions.has(transactionId)) {
      this.transactions.set(transactionId, [])
    }
  }

  async commitTransaction(transactionId: number): Promise<void> {
    const transactionsArray = this.transactions.get(transactionId)
    if (this.transactions.has(transactionId) && transactionsArray) {
      this.items.push(...transactionsArray)
      this.transactions.delete(transactionId)
    }
  }

  async rollbackTransaction(transactionId: number): Promise<void> {
    if (this.transactions.has(transactionId)) {
      this.transactions.delete(transactionId)
    }
  }
}
