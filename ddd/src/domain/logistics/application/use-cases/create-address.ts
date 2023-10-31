import { Address } from '../../enterprise/entities/address'
import { AddressRepository } from '../repositories/address.repository'

interface CreateAddressUseCaseRequest {
  road: string
  complement: string
  code: string
  city: string
  state: string
  sector: string
  number?: number
}
interface CreateAddressUseCaseResponse {
  address: Address
}

export class CreateAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute({
    city,
    code,
    complement,
    road,
    sector,
    state,
    number,
  }: CreateAddressUseCaseRequest): Promise<CreateAddressUseCaseResponse> {
    const address = Address.create({
      city,
      code,
      complement,
      road,
      sector,
      state,
      number,
    })

    await this.addressRepository.create(address)

    return { address }
  }
}
