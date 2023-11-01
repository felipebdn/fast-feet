import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '../../enterprise/entities/order'

export interface OrderRespository {
  create(order: Order): Promise<void>
  save(order: Order): Promise<void>
  findManyByCityAndState(
    city: string,
    state: string,
    props: PaginationParams,
  ): Promise<Order[]>
  findManyPendingById(deliveryId: string): Promise<Order[]>
  findManyCompletedById(deliveryId: string): Promise<Order[]>
  findById(id: string): Promise<Order | null>
  findByCode(code: string): Promise<Order | null>
  delete(id: string): Promise<void>
}
