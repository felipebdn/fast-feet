import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface EditDeliverymanUseCaseRequest {
  deliverymanId: string
  name: string
  cpf: string
  password_hash: string
  role: 'MEMBER' | 'ADMIN'
}

type EditDeliverymanUseCaseResponse = Either<ResourceNotFoundError, unknown>

export class EditDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    deliverymanId,
    cpf,
    password_hash,
    name,
    role,
  }: EditDeliverymanUseCaseRequest): Promise<EditDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    deliveryman.name = name
    deliveryman.cpf = cpf
    deliveryman.password_hash = password_hash
    deliveryman.role = role
    deliveryman.touch()

    await this.deliverymanRepository.save(deliveryman)

    return right({})
  }
}
