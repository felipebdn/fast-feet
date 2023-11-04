import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { MarkOrderIsColectedEvent } from '../events/mark-order-colected-event'

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
  returned?: Date
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

  get collected(): Date | undefined {
    return this.props.collected
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get returned(): Date | undefined {
    return this.props.returned
  }

  set recipientId(id: UniqueEntityID) {
    this.props.recipientId = id
    this.touch()
  }

  set deliveryId(deliveryId: UniqueEntityID) {
    this.props.deliveryId = deliveryId
    this.touch()
  }

  set bulk(bulk: number) {
    this.props.bulk = bulk
    this.touch()
  }

  set weight(weight: number) {
    this.props.weight = weight
    this.touch()
  }

  set rotule(rotule: string) {
    this.props.rotule = rotule
    this.touch()
  }

  set availablePickup(date: Date) {
    this.props.availablePickup = date
    this.touch()
  }

  set delivered(date: Date) {
    this.props.delivered = date
    this.touch()
  }

  set returned(date: Date) {
    this.props.returned = date
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  public markAsCollected(deliveryId: UniqueEntityID) {
    this.props.deliveryId = deliveryId
    this.props.collected = new Date()
    this.addDomainEvent(new MarkOrderIsColectedEvent(this))
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
