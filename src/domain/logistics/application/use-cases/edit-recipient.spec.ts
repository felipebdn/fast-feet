import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditRecipientUseCase } from './edit-recipient'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: EditRecipientUseCase

describe('Edit Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new EditRecipientUseCase(inMemoryRecipientRepository)
  })
  it('should be able to edit recipient', async () => {
    const recipient = makeRecipient(
      {
        name: 'name example',
      },
      new UniqueEntityID('recipient-01'),
    )
    await inMemoryRecipientRepository.create(recipient)

    await sut.execute({
      name: 'example name',
      recipientId: 'recipient-01',
    })

    expect(inMemoryRecipientRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'example name',
        id: new UniqueEntityID('recipient-01'),
      }),
    )
  })

  it('should be able to edit recipient with optional values', async () => {
    const recipient = makeRecipient(
      {
        name: 'name example',
        addressId: new UniqueEntityID('address-01'),
      },
      new UniqueEntityID('recipient-01'),
    )
    await inMemoryRecipientRepository.create(recipient)

    const result = await sut.execute({
      name: 'example name',
      recipientId: 'recipient-01',
      addressId: 'address-02',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientRepository.items[0]).toEqual(
      expect.objectContaining({
        name: 'example name',
        id: new UniqueEntityID('recipient-01'),
        addressId: new UniqueEntityID('address-02'),
      }),
    )
  })
})
