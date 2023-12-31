import { DeliverymanRepository } from '@/domain/logistics/application/repositories/deliveryman-repository'
import { Deliveryman } from '@/domain/logistics/enterprise/entities/deliveryman'

export class InMemoryDeliverymanRepository implements DeliverymanRepository {
  public items: Deliveryman[] = []

  async findByCPF(cpf: string) {
    const deliveryman = this.items.find((item) => item.cpf === cpf)
    if (!deliveryman) {
      return null
    }
    return deliveryman
  }

  async findById(id: string) {
    const deliveryman = this.items.find((item) => item.id.toString() === id)

    if (!deliveryman) {
      return null
    }
    return deliveryman
  }

  async create(deliveryman: Deliveryman) {
    this.items.push(deliveryman)
  }

  async save(deliveryman: Deliveryman) {
    const findIndex = this.items.findIndex((item) => item.id === deliveryman.id)
    this.items[findIndex] = deliveryman
  }

  async delete(id: string) {
    const currentIndex = this.items.findIndex(
      (item) => item.id.toString() === id,
    )
    this.items.splice(currentIndex, 1)
  }
}
