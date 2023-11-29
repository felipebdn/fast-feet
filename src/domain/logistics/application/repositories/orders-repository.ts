import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '../../enterprise/entities/order'

export abstract class OrderRepository {
  abstract create(order: Order, transactionId?: number): Promise<void>
  abstract save(order: Order, transactionId?: number): Promise<void>
  abstract findManyByCityAndState(
    city: string,
    state: string,
    props: PaginationParams,
  ): Promise<Order[]>

  abstract findManyPendingById(deliveryId: string): Promise<Order[]>
  abstract findManyCompletedById(deliveryId: string): Promise<Order[]>
  abstract findById(id: string): Promise<Order | null>
  abstract findByCode(code: string): Promise<Order | null>
  abstract delete(id: string, transactionId?: number): Promise<void>

  abstract createTransaction(transactionId: number): Promise<void>
  abstract commitTransaction(transactionId: number): Promise<void>
  abstract rollbackTransaction(transactionId: number): Promise<void>
}
