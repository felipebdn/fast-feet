import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueAlreadyExistsError } from '@/core/errors/errors/value-already-exists-error'

import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientRepository } from '../repositories/recipient-repository'

interface CreateRecipientUseCaseRequest {
  name: string
  addressId: string
}
export type CreateRecipientUseCaseResponse = Either<
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
