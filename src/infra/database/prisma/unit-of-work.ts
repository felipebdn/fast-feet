/* eslint-disable @typescript-eslint/no-explicit-any */
import { Transaction } from '@/domain/logistics/application/transaction/transaction'
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'

// // O tipo do nosso fn (operação)
// type Fn<FnParams, FnReturn> = (params: FnParams) => FnReturn

// // O tipo de nossa instrução
// type Instruction<FnParams, FnReturn> = {
//   params: FnParams
//   fn: Fn<FnParams, FnReturn>
// }

// // O tipo de função de alta ordem
// type Hof = <HofReturn>(
//   callback: <FnParams, FnReturn>(
//     instruction: Instruction<FnParams, FnReturn>,
//   ) => HofReturn,
// ) => Hof

// // O tipo de função que cria hof
// type CreateHof = <FnParams, FnReturn>(
//   instruction: Instruction<FnParams, FnReturn>,
// ) => Hof
@Injectable()
export class UnitOfWork implements Transaction {
  private _operations: any[] = []

  constructor(private prisma: PrismaService) {}

  createTransaction(operations: any[]) {
    this._operations = operations
  }

  // createHof<FnParams, FnReturn>(instruction: Instruction<FnParams, FnReturn>) {
  //   ;(callback) => callback(instruction)
  // }

  async commit(): Promise<boolean> {
    try {
      this.prisma.$transaction(async (tx) => {
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
