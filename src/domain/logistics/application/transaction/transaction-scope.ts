export abstract class TransactionScope {
  abstract run(fn: () => Promise<void>): Promise<void>
}
