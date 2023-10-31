import { Order } from '../../enterprise/entities/order'

export interface OrderRespository {
  create(order: Order): Promise<void>
  findById(id: string): Promise<Order | null>
}
