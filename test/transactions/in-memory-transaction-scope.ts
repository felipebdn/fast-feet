import { TransactionScope } from '@/domain/logistics/application/transaction/transaction-scope'

export class InMemoryTransactionScope implements TransactionScope {
  async run(fn: () => Promise<void>): Promise<void> {
    await fn()
  }
}
