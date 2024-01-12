import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

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

type EditAddressUseCaseResponse = Either<ResourceNotFoundError, unknown>

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
  }: EditAddressUseCaseRequest): Promise<EditAddressUseCaseResponse> {
    const address = await this.addressRepository.findById(addressId)

    if (!address) {
      return left(new ResourceNotFoundError())
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

    return right({})
  }
}
