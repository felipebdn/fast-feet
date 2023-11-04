import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AddressRepository } from '@/domain/logistics/application/repositories/address-repository'
import { OrderRespository } from '@/domain/logistics/application/repositories/orders-repository'
import { Order } from '@/domain/logistics/enterprise/entities/order'

export class InMemoryOrderRepository implements OrderRespository {
  constructor(private addressRepository: AddressRepository) {}

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
          item.collected === undefined &&
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
    // console.log('criando', this.items[0].collected)
  }

  async save(order: Order) {
    // console.log(this.items[0].collected)

    const findIndex = this.items.findIndex((item) => item.id === order.id)
    // console.log('antes', this.items[findIndex].collected, !!order.collected)
    // console.log('depois', order.collected, !!order.collected)

    // if (!this.items[findIndex].collected && !!order.collected) {
    DomainEvents.dispatchEventsForEntity(order.id)
    // }
    this.items[findIndex] = order
  }

  async delete(id: string) {
    const currentIndex = this.items.findIndex(
      (item) => item.id.toString() === id,
    )
    this.items.splice(currentIndex, 1)
  }
}
