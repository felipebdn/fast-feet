import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditDeliverymanUseCaseRequest {
  addressId: string
  deliverymanId: string
  name: string
  cpf: string
  hash_password: string
}

type EditDeliverymanUseCaseResponse = Either<ResourceNotFoundError, unknown>

export class EditDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    deliverymanId,
    cpf,
    hash_password: hashPassword,
    name,
    addressId,
  }: EditDeliverymanUseCaseRequest): Promise<EditDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    deliveryman.name = name
    deliveryman.cpf = cpf
    deliveryman.hash_password = hashPassword
    deliveryman.addressId = new UniqueEntityID(addressId)
    deliveryman.touch()

    await this.deliverymanRepository.save(deliveryman)

    return right({})
  }
}
