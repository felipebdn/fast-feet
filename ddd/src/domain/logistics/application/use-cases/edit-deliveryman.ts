import { DeliverymanRepository } from '../repositories/deliveryman-repository'

interface EditDeliverymanUseCaseRequest {
  deliverymanId: string
  name: string
  cpf: string
  hash_password: string
}

export class EditDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    deliverymanId,
    cpf,
    hash_password,
    name,
  }: EditDeliverymanUseCaseRequest): Promise<void> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      throw new Error('Deliveryman not found.')
    }

    deliveryman.name = name
    deliveryman.cpf = cpf
    deliveryman.hash_password = hash_password
    deliveryman.touch()

    await this.deliverymanRepository.save(deliveryman)
  }
}
