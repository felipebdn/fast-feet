import { UseCaseError } from '@/core/errors/use-case-error'

export class PasswordAlreadyUsedError extends Error implements UseCaseError {
  constructor() {
    super('Password already used.')
  }
}
