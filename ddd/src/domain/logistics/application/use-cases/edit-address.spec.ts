import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditAddressUseCase } from './edit-address'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import { makeAddress } from 'test/factories/make-address'

let inMemoryAddressRepository: InMemoryAddressRepository
let sut: EditAddressUseCase

describe('Edit Address', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    sut = new EditAddressUseCase(inMemoryAddressRepository)
  })
  it('should be able to edit address', async () => {
    const address = makeAddress(
      {
        city: 'city example',
        code: '00000-00',
        complement: 'complement example',
        county: 'county example',
        state: 'state example',
        street: 'street example',
      },
      new UniqueEntityID('address-01'),
    )
    await inMemoryAddressRepository.create(address)

    await sut.execute({
      city: 'example city',
      code: '11111-11',
      complement: 'example complement',
      county: 'example county',
      state: 'example state',
      street: 'example street',
      addressId: 'address-01',
    })

    expect(inMemoryAddressRepository.items[0]).toEqual(
      expect.objectContaining({
        city: 'example city',
        code: '11111-11',
        complement: 'example complement',
        county: 'example county',
        state: 'example state',
        street: 'example street',
      }),
    )
  })

  it('should be able to edit address with optional values', async () => {
    const address = makeAddress(
      {
        city: 'city example',
        code: '00000-00',
        complement: 'complement example',
        county: 'county example',
        state: 'state example',
        street: 'street example',
        number: 12345,
      },
      new UniqueEntityID('address-01'),
    )
    await inMemoryAddressRepository.create(address)

    await sut.execute({
      city: 'example city',
      code: '11111-11',
      complement: 'example complement',
      county: 'example county',
      state: 'example state',
      street: 'example street',
      addressId: 'address-01',
      number: 54321,
    })

    expect(inMemoryAddressRepository.items[0]).toEqual(
      expect.objectContaining({
        city: 'example city',
        code: '11111-11',
        complement: 'example complement',
        county: 'example county',
        state: 'example state',
        street: 'example street',
        number: 54321,
      }),
    )
  })
})
