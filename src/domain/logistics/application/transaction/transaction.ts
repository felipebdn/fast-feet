/* eslint-disable @typescript-eslint/no-explicit-any */
export abstract class Transaction {
  abstract createTransaction(operations: any[]): void
  // abstract createHof<FnParams, FnReturn>(
  //   instruction: Instruction<FnParams, FnReturn>,
  // ): Promise<CreateHof>

  abstract commit(): Promise<boolean>
}
