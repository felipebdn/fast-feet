import { Either, left, right } from '@/core/either'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ValueAlreadyExistsError } from './errors/value-already-exists-error'

interface CreateDeliverymanUseCaseRequest {
  name: string
  cpf: string
  hash_password: string
}
type CreateDeliverymanUseCaseResponse = Either<ValueAlreadyExistsError, unknown>

export class CreateDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    cpf,
    hash_password,
    name,
  }: CreateDeliverymanUseCaseRequest): Promise<CreateDeliverymanUseCaseResponse> {
    const isCPFAlreadExists = await this.deliverymanRepository.findByCPF(cpf)

    if (isCPFAlreadExists) {
      return left(new ValueAlreadyExistsError('CPF'))
    }

    const deliveryman = Deliveryman.create({
      cpf,
      hash_password,
      name,
    })

    await this.deliverymanRepository.create(deliveryman)

    return right({})
  }
}
