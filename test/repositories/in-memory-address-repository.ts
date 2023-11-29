import { AddressRepository } from '@/domain/logistics/application/repositories/address-repository'
import { Address } from '@/domain/logistics/enterprise/entities/address'

export class InMemoryAddressRepository implements AddressRepository {
  private transactions: Map<number, Address[]> = new Map()
  public items: Address[] = []

  async findManyByCityAndState(city: string, state: string) {
    const locals = this.items.filter(
      (item) => item.city === city && item.state === state,
    )
    return locals
  }

  async findById(id: string) {
    const address = this.items.find((item) => item.id.toString() === id)
    if (!address) {
      return null
    }
    return address
  }

  async create(address: Address, transactionId?: number) {
    if (transactionId !== undefined) {
      if (!this.transactions.has(transactionId)) {
        this.transactions.set(transactionId, [])
      }
      const transactionsArray = this.transactions.get(transactionId)
      if (transactionsArray) {
        transactionsArray.push(address)
      }
    } else {
      this.items.push(address)
    }
  }

  async save(address: Address, transactionId?: number) {
    if (transactionId !== undefined) {
      const transactionsArray = this.transactions.get(transactionId)
      if (transactionsArray) {
        const findIndex = transactionsArray.findIndex(
          (item) => item.id === address.id,
        )
        transactionsArray[findIndex] = address
      }
    } else {
      const findIndex = this.items.findIndex((item) => item.id === address.id)
      this.items[findIndex] = address
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
