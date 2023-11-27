import { Either, left, right } from '@/core/either'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ValueAlreadyExistsError } from '../../../../core/errors/errors/value-already-exists-error'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'

interface CreateDeliverymanUseCaseRequest {
  name: string
  cpf: string
  password: string
  role?: 'MEMBER' | 'ADMIN'
}
type CreateDeliverymanUseCaseResponse = Either<
  ValueAlreadyExistsError,
  {
    deliveryman: Deliveryman
  }
>

@Injectable()
export class CreateDeliverymanUseCase {
  constructor(
    private deliverymanRepository: DeliverymanRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    cpf,
    password,
    name,
    role,
  }: CreateDeliverymanUseCaseRequest): Promise<CreateDeliverymanUseCaseResponse> {
    const isCPFAlreadExists = await this.deliverymanRepository.findByCPF(cpf)

    if (isCPFAlreadExists) {
      return left(new ValueAlreadyExistsError('CPF'))
    }

    const password_hash = await this.hashGenerator.hash(password)

    const deliveryman = Deliveryman.create({
      cpf,
      password_hash,
      name,
      role,
    })

    await this.deliverymanRepository.create(deliveryman)

    return right({ deliveryman })
  }
}
