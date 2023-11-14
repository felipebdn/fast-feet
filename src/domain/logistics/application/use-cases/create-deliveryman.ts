import { Either, left, right } from '@/core/either'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ValueAlreadyExistsError } from '../../../../core/errors/errors/value-already-exists-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'

interface CreateDeliverymanUseCaseRequest {
  addressId: string
  name: string
  cpf: string
  password: string
}
type CreateDeliverymanUseCaseResponse = Either<ValueAlreadyExistsError, unknown>

@Injectable()
export class CreateDeliverymanUseCase {
  constructor(
    private deliverymanRepository: DeliverymanRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    addressId,
    cpf,
    password,
    name,
  }: CreateDeliverymanUseCaseRequest): Promise<CreateDeliverymanUseCaseResponse> {
    const isCPFAlreadExists = await this.deliverymanRepository.findByCPF(cpf)

    if (isCPFAlreadExists) {
      return left(new ValueAlreadyExistsError('CPF'))
    }

    const hash_password = await this.hashGenerator.hash(password)

    const deliveryman = Deliveryman.create({
      addressId: new UniqueEntityID(addressId),
      cpf,
      hash_password,
      name,
    })

    await this.deliverymanRepository.create(deliveryman)

    return right({})
  }
}
