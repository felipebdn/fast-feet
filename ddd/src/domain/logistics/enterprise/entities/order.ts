import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface OrderProps {
  recipientId: UniqueEntityID
  addressId: UniqueEntityID
  deliveryId?: UniqueEntityID
  rotule: string
  weight: number
  bulk: number
  createdAt: Date
  withdrawal?: Date
  updatedAt?: Date
}

export class Order extends Entity<OrderProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get addressId() {
    return this.props.addressId
  }

  get deliveryId() {
    return this.props.deliveryId
  }

  set deliveryId(id: UniqueEntityID) {
    this.props.deliveryId = id
  }

  get rotule() {
    return this.props.rotule
  }

  get weight() {
    return this.props.weight
  }

  get bulk() {
    return this.props.bulk
  }

  get createdAt() {
    return this.props.createdAt
  }

  get withdrawal() {
    return this.props.withdrawal
  }

  get updateAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<OrderProps, 'createdAt'>, id?: UniqueEntityID) {
    const order = new Order(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
    return order
  }
}
