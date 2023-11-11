import { Either, left, right } from '@/core/either'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ValueAlreadyExistsError } from '../../../../core/errors/errors/value-already-exists-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

interface CreateDeliverymanUseCaseRequest {
  addressId: string
  name: string
  cpf: string
  hash_password: string
}
type CreateDeliverymanUseCaseResponse = Either<ValueAlreadyExistsError, unknown>

@Injectable()
export class CreateDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    addressId,
    cpf,
    hash_password: hashPassword,
    name,
  }: CreateDeliverymanUseCaseRequest): Promise<CreateDeliverymanUseCaseResponse> {
    const isCPFAlreadExists = await this.deliverymanRepository.findByCPF(cpf)

    if (isCPFAlreadExists) {
      return left(new ValueAlreadyExistsError('CPF'))
    }

    const deliveryman = Deliveryman.create({
      addressId: new UniqueEntityID(addressId),
      cpf,
      hash_password: hashPassword,
      name,
    })

    await this.deliverymanRepository.create(deliveryman)

    return right({})
  }
}
