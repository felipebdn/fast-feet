import { OrderRespository } from '@/domain/logistics/application/repositories/orders-repository'
import { Order } from '@/domain/logistics/enterprise/entities/order'

export class InMemoryOrderRepository implements OrderRespository {
  public items: Order[] = []
  async create(order: Order) {
    this.items.push(order)
  }
}
