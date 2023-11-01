import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface OrderProps {
  recipientId: UniqueEntityID
  addressId: UniqueEntityID
  deliveryId?: UniqueEntityID
  code: string
  rotule: string
  weight: number
  bulk: number
  createdAt: Date
  availablePickup?: Date
  delivered?: Date
  collected?: Date
  updatedAt?: Date
}

export class Order extends Entity<OrderProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get addressId() {
    return this.props.addressId
  }

  get deliveryId(): UniqueEntityID | undefined {
    return this.props.deliveryId
  }

  get code() {
    return this.props.code
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

  get availablePickup(): Date | undefined {
    return this.props.availablePickup
  }

  get delivered(): Date | undefined {
    return this.props.delivered
  }

  get collected() {
    return this.props.collected
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set recipientId(id: UniqueEntityID) {
    this.props.recipientId = id
  }

  set deliveryId(id: UniqueEntityID) {
    this.props.deliveryId = id
    this.props.collected = new Date()
  }

  set bulk(bulk: number) {
    this.props.bulk = bulk
  }

  set weight(weight: number) {
    this.props.weight = weight
  }

  set rotule(rotule: string) {
    this.props.rotule = rotule
  }

  set availablePickup(date: Date) {
    this.props.availablePickup = date
  }

  set delivered(date: Date) {
    this.props.delivered = date
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<OrderProps, 'createdAt'>, id?: UniqueEntityID) {
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return order
  }
}
