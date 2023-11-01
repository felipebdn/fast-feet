import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '../../enterprise/entities/order'

export interface OrderRespository {
  create(order: Order): Promise<void>
  findManyById(deliveryId: string, props: PaginationParams): Promise<Order[]>
  findById(id: string): Promise<Order | null>
  delete(id: string): Promise<void>
}
