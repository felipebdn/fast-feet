import { UseCaseError } from '@/core/errors/use-case-error'

export class OrderNotIsReturnedError extends Error implements UseCaseError {
  constructor() {
    super('Order not is returned.')
  }
}
