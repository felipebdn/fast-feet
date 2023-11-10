import { UseCaseError } from '@/core/errors/use-case-error'

export class ValueAlreadyExistsError extends Error implements UseCaseError {
  constructor(value: string) {
    super(`${value} already exists error`)
  }
}
