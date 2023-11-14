import { Order } from '@/domain/logistics/enterprise/entities/order'

export class HTTPOrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      rotule: order.rotule,
      code: order.code,
      weight: order.weight,
      bulk: order.bulk,
      status: order.status,
      createdAt: order.createdAt,
    }
  }
}
