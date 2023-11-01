import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RecipientRepository } from '../repositories/recipient-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditRecipientUseCaseRequest {
  recipientId: string
  name: string
  addressId?: string
}

type EditRecipientUseCaseResponse = Either<ResourceNotFoundError, unknown>

export class EditRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    name,
    recipientId,
    addressId,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    recipient.name = name
    if (addressId) {
      recipient.addressId = new UniqueEntityID(addressId)
    }
    recipient.touch()

    await this.recipientRepository.save(recipient)

    return right({})
  }
}
