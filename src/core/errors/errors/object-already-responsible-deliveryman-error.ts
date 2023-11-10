import { UseCaseError } from '@/core/errors/use-case-error'

export class ObjectAlreadyResponsibleDeliveryman
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Object already has a responsible delivery person.')
  }
}
