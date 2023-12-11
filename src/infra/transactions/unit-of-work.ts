import { Transaction } from '@/domain/logistics/application/transaction/transaction'

export class UnitOfWork implements Transaction {
  async createTransaction(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async createHof(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async commit(): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
