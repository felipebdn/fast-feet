import { DeliverymanRepository } from '@/domain/logistics/application/repositories/deliveryman-repository'
import { Deliveryman } from '@/domain/logistics/enterprise/entities/deliveryman'

export class InMemoryDeliverymanRepository implements DeliverymanRepository {
  public items: Deliveryman[] = []
  async create(deliveryman: Deliveryman) {
    this.items.push(deliveryman)
  }
}
