// O tipo do nosso fn (operação)
type Fn<FnParams, FnReturn> = (params: FnParams) => FnReturn

// The type of our instruction
type Instruction<FnParams, FnReturn> = {
  params: FnParams
  fn: Fn<FnParams, FnReturn>
}

// The type of High Order Function
type Hof = <HofReturn>(
  callback: <FnParams, FnReturn>(
    instruction: Instruction<FnParams, FnReturn>,
  ) => HofReturn,
) => Hof

// The type of function that create hof
type CreateHof = <FnParams, FnReturn>(
  instruction: Instruction<FnParams, FnReturn>,
) => Hof

export abstract class Transaction {
  abstract createTransaction(hofs: Hof[]): Promise<void>
  abstract createHof(): Promise<CreateHof>
  abstract commit(): Promise<boolean>
}
