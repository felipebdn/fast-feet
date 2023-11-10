import { UseCaseError } from '@/core/errors/use-case-error'

export class OrderNotIsColectedError extends Error implements UseCaseError {
  constructor() {
    super('Order not is colected.')
  }
}
