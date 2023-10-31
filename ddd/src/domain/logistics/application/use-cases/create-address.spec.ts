import { makeAddress } from 'test/factories/make-address'
import { CreateAddressUseCase } from './create-address'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'

let inMemoryAddressRepository: InMemoryAddressRepository
let sut: CreateAddressUseCase

describe('Create Address', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    sut = new CreateAddressUseCase(inMemoryAddressRepository)
  })
  it('should be able to create a new address', async () => {
    const address = makeAddress({ city: 'city-name' })

    await sut.execute(address)

    expect(address.id).toBeTruthy()
    expect(inMemoryAddressRepository.items[0].city).toEqual('city-name')
  })
})
