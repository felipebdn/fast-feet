import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrderRespository } from '@/domain/logistics/application/repositories/orders-repository'
import { Order } from '@/domain/logistics/enterprise/entities/order'

export class PrismaOrdersRepository implements OrderRespository {
  create(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }

  save(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findManyByCityAndState(
    city: string,
    state: string,
    props: PaginationParams,
  ): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }

  findManyPendingById(deliveryId: string): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }

  findManyCompletedById(deliveryId: string): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<Order | null> {
    throw new Error('Method not implemented.')
  }

  findByCode(code: string): Promise<Order | null> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
