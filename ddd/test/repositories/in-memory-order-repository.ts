import { OrderRespository } from '@/domain/logistics/application/repositories/orders-repository'
import { Order } from '@/domain/logistics/enterprise/entities/order'

export class InMemoryOrderRepository implements OrderRespository {
  public items: Order[] = []

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id)
    if (!order) {
      return null
    }
    return order
  }

  async findManyCompletedById(deliveryId: string) {
    const orders = this.items
      .filter(
        (item) =>
          item.deliveryId?.toString() === deliveryId &&
          !!item.collected &&
          !!item.delivered,
      )
      .sort((a, b) => b.createdAt.getDate() - a.createdAt.getDate())

    return orders
  }

  async findManyPendingById(deliveryId: string) {
    const orders = this.items
      .filter(
        (item) =>
          item.deliveryId?.toString() === deliveryId &&
          !!item.collected &&
          !item.delivered,
      )
      .sort((a, b) => b.createdAt.getDate() - a.createdAt.getDate())

    return orders
  }

  async create(order: Order) {
    this.items.push(order)
  }

  async delete(id: string) {
    const currentIndex = this.items.findIndex(
      (item) => item.id.toString() === id,
    )
    this.items.splice(currentIndex, 1)
  }
}
