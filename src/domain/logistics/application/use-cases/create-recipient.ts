import { RecipientRepository } from '../repositories/recipient-repository'
import { Recipient } from '../../enterprise/entities/recipient'
import { Either, right } from '@/core/either'
import { ValueAlreadyExistsError } from '@/core/errors/errors/value-already-exists-error'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateRecipientUseCaseRequest {
  name: string
  addressId: string
}
type CreateRecipientUseCaseResponse = Either<
  ValueAlreadyExistsError,
  { recipient: Recipient }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    name,
    addressId,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const recipient = Recipient.create({
      addressId: new UniqueEntityID(addressId),
      name,
    })
    await this.recipientRepository.create(recipient)

    return right({ recipient })
  }
}
