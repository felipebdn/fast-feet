import { UseCaseError } from '@/core/errors/use-case-error'

export class CreateOrderError extends Error implements UseCaseError {
  constructor() {
    super('Error in the order registration process.')
  }
}
