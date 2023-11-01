import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RecipientRepository } from '../repositories/recipient-repository'

interface EditRecipientUseCaseRequest {
  recipientId: string
  name: string
  addressId?: string
}

export class EditRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    name,
    recipientId,
    addressId,
  }: EditRecipientUseCaseRequest): Promise<void> {
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      throw new Error('Recipient not found.')
    }

    recipient.name = name
    if (addressId) {
      recipient.addressId = new UniqueEntityID(addressId)
    }
    recipient.touch()

    await this.recipientRepository.save(recipient)
  }
}
