import { AddressRepository } from '../repositories/address-repository'
import { Address } from '../../enterprise/entities/address'
import { Either, right } from '@/core/either'
import { ValueAlreadyExistsError } from '@/core/errors/errors/value-already-exists-error'
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
type CreateAddressUseCaseResponse = Either<unknown, { address: Address }>

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
