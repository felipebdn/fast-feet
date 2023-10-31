import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { CreateRecipientUseCase } from './create-recipient'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: CreateRecipientUseCase

describe('Create Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new CreateRecipientUseCase(inMemoryRecipientRepository)
  })
  it('should be able to create a new recipeint', async () => {
    const recipient = makeRecipient({
      name: 'recipient name',
    })
    await sut.execute(recipient)

    expect(inMemoryRecipientRepository.items[0].name).toEqual('recipient name')
  })
})
