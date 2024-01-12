import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'

import { ValueAlreadyExistsError } from '../../../../core/errors/errors/value-already-exists-error'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { HashGenerator } from '../cryptography/hash-generator'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { TransactionScope } from '../transaction/transaction-scope'

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
    private transactionScope: TransactionScope,
  ) {}

  async execute({
    cpf,
    password,
    name,
    role,
  }: CreateDeliverymanUseCaseRequest): Promise<CreateDeliverymanUseCaseResponse> {
    const isCPFAlreadyExists = await this.deliverymanRepository.findByCPF(cpf)

    if (isCPFAlreadyExists) {
      return left(new ValueAlreadyExistsError('CPF'))
    }

    const password_hash = await this.hashGenerator.hash(password)

    const deliveryman = Deliveryman.create({
      cpf,
      password_hash,
      name,
      role,
    })

    await this.transactionScope.run(async () => {
      await this.deliverymanRepository.create(deliveryman)
    })

    return right({ deliveryman })
  }
}
