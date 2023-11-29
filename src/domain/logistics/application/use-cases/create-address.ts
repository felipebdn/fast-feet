import { AddressRepository } from '../repositories/address-repository'
import { Address } from '../../enterprise/entities/address'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface createAddressUseCaseRequest {
  street: string
  complement: string
  code: string
  city: string
  state: string
  county: string
  number?: number
}
export type CreateAddressUseCaseResponse = Either<unknown, { address: Address }>

@Injectable()
export class CreateAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute(
    data: createAddressUseCaseRequest,
  ): Promise<CreateAddressUseCaseResponse> {
    const address = Address.create(data)
    await this.addressRepository.create(address)

    return right({ address })
  }
}
