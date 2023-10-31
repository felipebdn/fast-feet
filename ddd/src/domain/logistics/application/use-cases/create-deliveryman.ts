import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'

interface CreateDeliverymanUseCaseRequest {
  name: string
  cpf: string
  hash_password: string
}
interface CreateDeliverymanUseCaseResponse {
  deliveryman: Deliveryman
}

export class CreateDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    cpf,
    hash_password,
    name,
  }: CreateDeliverymanUseCaseRequest): Promise<CreateDeliverymanUseCaseResponse> {
    const deliveryman = Deliveryman.create({
      cpf,
      hash_password,
      name,
    })

    await this.deliverymanRepository.create(deliveryman)

    return { deliveryman }
  }
}
