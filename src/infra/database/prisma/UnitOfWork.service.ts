/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaService } from './prisma.service'

type Fn<FnParams, FnReturn> = (params: FnParams) => FnReturn
type Instruction<FnParams, FnReturn> = {
  params: FnParams
  fn: Fn<FnParams, FnReturn>
}
type Hof = <HofReturn>(
  callback: <FnParams, FnReturn>(
    instruction: Instruction<FnParams, FnReturn>,
  ) => HofReturn,
) => HofReturn
type CreateHof = <FnParams, FnReturn>(
  instruction: Instruction<FnParams, FnReturn>,
) => Hof

export class UnitOfWork<T extends PrismaService> {
  private _databaseConnection: T
  private _operations: any[] = []

  constructor(databaseConnection: T) {
    this._databaseConnection = databaseConnection
  }

  public createTransaction(operations: any[]) {
    this._operations = operations
  }

  async commit(): Promise<boolean> {
    try {
      this._databaseConnection.$transaction(async (tx) => {
        for (const operation of this._operations) {
          await operation.fn(operation.params, tx)
        }
      })
      return true
    } catch (error) {
      throw new Error('error')
    }
  }
}
