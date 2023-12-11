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
  private _hofs: Hof[] = []

  constructor(databaseConnection: T) {
    this._databaseConnection = databaseConnection
  }

  public createTransaction(hofs: Hof[]) {
    this._hofs = hofs
  }

  public createHof =
    <FnParams, FnReturn>(instruction: Instruction<FnParams, FnReturn>) =>
    (callback) =>
      callback(instruction)

  async commit(): Promise<boolean> {
    try {
      this._databaseConnection.$transaction(async (tx) => {
        this._hofs.forEach((hof) => {
          hof(async (instruction) => {
            await instruction.fn(instruction.params, tx)
          })
        })
      })
      return true
    } catch (error) {
      throw new Error('error')
    }
  }
}
