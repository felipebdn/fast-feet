import { AddressRepository } from '../repositories/address-repository'

interface EditAddressUseCaseRequest {
  addressId: string
  street: string
  complement: string
  code: string
  city: string
  state: string
  county: string
  number?: number
}

export class EditAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute({
    addressId,
    city,
    code,
    complement,
    street,
    county,
    state,
    number,
  }: EditAddressUseCaseRequest): Promise<void> {
    const address = await this.addressRepository.findById(addressId)

    if (!address) {
      throw new Error('Address not found.')
    }

    address.city = city
    address.code = code
    address.complement = complement
    address.street = street
    address.county = county
    address.state = state
    if (number) {
      address.number = number
    }
    address.touch()

    await this.addressRepository.save(address)
  }
}
