import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '../../enterprise/entities/order'
import * as runtime from '@prisma/client/runtime/library'
import { PrismaClient } from '@prisma/client'

export abstract class OrderRepository {
  abstract create(
    order: Order,
    tx?: Omit<PrismaClient, runtime.ITXClientDenyList>,
  ): Promise<void>

  abstract save(order: Order): Promise<void>

  abstract delete(id: string): Promise<void>

  abstract findManyByCityAndState(
    city: string,
    state: string,
    props: PaginationParams,
  ): Promise<Order[]>

  abstract findManyPendingById(deliveryId: string): Promise<Order[]>
  abstract findManyCompletedById(deliveryId: string): Promise<Order[]>
  abstract findById(id: string): Promise<Order | null>
  abstract findByCode(code: string): Promise<Order | null>
}
