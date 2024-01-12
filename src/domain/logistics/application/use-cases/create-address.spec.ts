import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'

import { CreateAddressUseCase } from './create-address'

let inMemoryAddressRepository: InMemoryAddressRepository
let sut: CreateAddressUseCase

describe('Create Address', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    sut = new CreateAddressUseCase(inMemoryAddressRepository)
  })
  it('should be able to create a new address', async () => {
    const result = await sut.execute({
      city: 'city example',
      code: 'code-01',
      complement: 'complement example',
      county: 'county example',
      state: 'state example',
      street: 'state street',
      number: undefined,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      address: inMemoryAddressRepository.items[0],
    })
  })
})
