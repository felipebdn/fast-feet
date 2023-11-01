import { AddressRepository } from '../repositories/address-repository'

interface EditAddressnUseCaseRequest {
  addressId: string
  road: string
  complement: string
  code: string
  city: string
  state: string
  sector: string
  number?: number
}

export class EditAddressnUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute({
    addressId,
    city,
    code,
    complement,
    road,
    sector,
    state,
    number,
  }: EditAddressnUseCaseRequest): Promise<void> {
    const address = await this.addressRepository.findById(addressId)

    if (!address) {
      throw new Error('Address not found.')
    }

    address.city = city
    address.code = code
    address.complement = complement
    address.road = road
    address.sector = sector
    address.state = state
    address.number = number
  }
}
