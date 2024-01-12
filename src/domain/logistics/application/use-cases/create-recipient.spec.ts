import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'

import { CreateRecipientUseCase } from './create-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: CreateRecipientUseCase

describe('Create Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new CreateRecipientUseCase(inMemoryRecipientRepository)
  })
  it('should be able to create a new recipient', async () => {
    const result = await sut.execute({
      addressId: 'address-01',
      name: 'John Doe',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      recipient: inMemoryRecipientRepository.items[0],
    })
  })
})
