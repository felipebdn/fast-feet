import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AddressRepository } from '@/domain/logistics/application/repositories/address-repository'
import { OrderRepository } from '@/domain/logistics/application/repositories/orders-repository'
import { Order } from '@/domain/logistics/enterprise/entities/order'

export class InMemoryOrderRepository implements OrderRepository {
  constructor(private addressRepository: AddressRepository) {}

  private transactions: Map<number, Order[]> = new Map()
  public items: Order[] = []

  async findManyByCityAndState(
    city: string,
    state: string,
    { amount, page }: PaginationParams,
  ): Promise<Order[]> {
    const addressSameCityAndState =
      await this.addressRepository.findManyByCityAndState(city, state)

    const addressIds = addressSameCityAndState.map((item) => item.id.toString())

    const orders = this.items
      .filter(
        (item) =>
          item.status === 'waiting' &&
          addressIds.includes(item.addressId.toString()),
      )
      .sort((a, b) => b.createdAt.getDate() - a.createdAt.getDate())
      .slice((page - 1) * amount, page * amount)

    return orders
  }

  async findByCode(code: string) {
    const order = this.items.find((item) => item.code === code)
    if (!order) {
      return null
    }
    return order
  }

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
          item.status === 'delivered',
      )
      .sort((a, b) => b.createdAt.getDate() - a.createdAt.getDate())

    return orders
  }

  async findManyPendingById(deliveryId: string) {
    const orders = this.items
      .filter(
        (item) =>
          item.deliveryId?.toString() === deliveryId &&
          item.status === 'collected',
      )
      .sort((a, b) => b.createdAt.getDate() - a.createdAt.getDate())

    return orders
  }

  async create(order: Order, transactionId?: number) {
    if (transactionId !== undefined) {
      if (!this.transactions.has(transactionId)) {
        this.transactions.set(transactionId, [])
      }
      const transactionsArray = this.transactions.get(transactionId)
      if (transactionsArray) {
        transactionsArray.push(order)
      }
    } else {
      this.items.push(order)
    }
  }

  async save(order: Order, transactionId?: number) {
    if (transactionId !== undefined) {
      const transactionsArray = this.transactions.get(transactionId)
      if (transactionsArray) {
        const findIndex = transactionsArray.findIndex(
          (item) => item.id.toValue() === order.id.toValue(),
        )
        transactionsArray[findIndex] = order
        DomainEvents.dispatchEventsForEntity(order.id)
      }
    } else {
      const findIndex = this.items.findIndex(
        (item) => item.id.toValue() === order.id.toValue(),
      )
      this.items[findIndex] = order

      DomainEvents.dispatchEventsForEntity(order.id)
    }
  }

  async delete(id: string, transactionId?: number) {
    if (transactionId !== undefined) {
      const transactionsArray = this.transactions.get(transactionId)
      if (transactionsArray) {
        const currentIndex = transactionsArray.findIndex(
          (item) => item.id.toString() === id,
        )
        transactionsArray.splice(currentIndex, 1)
      }
    } else {
      const currentIndex = this.items.findIndex(
        (item) => item.id.toString() === id,
      )
      this.items.splice(currentIndex, 1)
    }
  }

  async createTransaction(transactionId: number): Promise<void> {
    if (!this.transactions.has(transactionId)) {
      this.transactions.set(transactionId, [])
    }
  }

  async commitTransaction(transactionId: number): Promise<void> {
    const transactionsArray = this.transactions.get(transactionId)
    if (this.transactions.has(transactionId) && transactionsArray) {
      this.items.push(...transactionsArray)
      this.transactions.delete(transactionId)
    }
  }

  async rollbackTransaction(transactionId: number): Promise<void> {
    if (this.transactions.has(transactionId)) {
      this.transactions.delete(transactionId)
    }
  }
}
