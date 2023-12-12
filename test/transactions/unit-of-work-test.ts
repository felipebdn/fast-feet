/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transaction } from '@/domain/logistics/application/transaction/transaction'

export class InMemoryTransactions implements Transaction {
  private _operations: any[] = []

  createTransaction(operations: any[]): void {
    this._operations = operations
  }

  async commit(): Promise<boolean> {
    try {
      for (const operation of this._operations) {
        operation.fn(operation)
      }
      return true
    } catch (error) {
      throw new Error('error')
    }
  }
}
