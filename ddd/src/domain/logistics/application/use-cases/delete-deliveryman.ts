import { DeliverymanRepository } from '../repositories/deliveryman-repository'

interface DeleteDeliverymanUseCaseRequest {
  deliverymanId: string
}
// interface DeleteDeliverymanUseCaseResponse {}

export class DeleteDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    deliverymanId,
  }: DeleteDeliverymanUseCaseRequest): Promise<void> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      throw new Error('Deliveryman not found.')
    }

    await this.deliverymanRepository.delete(deliverymanId)
  }
}
