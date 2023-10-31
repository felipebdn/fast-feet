import { RecipientRepository } from '../repositories/recipient-repository'
import { Recipient } from '../../enterprise/entities/recipient'

interface CreateRecipientUseCaseRequest {
  name: string
}
interface CreateRecipientUseCaseResponse {
  recipient: Recipient
}

export class CreateRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    name,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const recipient = Recipient.create({
      name,
    })

    await this.recipientRepository.create(recipient)

    return { recipient }
  }
}
