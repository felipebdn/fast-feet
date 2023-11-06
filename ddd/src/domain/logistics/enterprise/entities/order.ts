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
  updatedAt?: Date
  state: 'waiting' | 'collected' | 'delivered' | 'returned' | 'availablePickup'
  updateAtStatus?: Date
}

export class Order extends Entity<OrderProps> {
  // GETS
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

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  get state() {
    return this.props.state
  }

  get updateAtStatus() {
    return this.props.updateAtStatus
  }

  // SETS

  set recipientId(id: UniqueEntityID) {
    this.props.recipientId = id
    this.touch()
  }

  set addressId(id: UniqueEntityID) {
    this.props.addressId = id
    this.touch()
  }

  set deliveryId(id: UniqueEntityID) {
    this.props.deliveryId = id
    this.touch()
  }

  set code(code: string) {
    this.props.code = code
    this.touch()
  }

  set rotule(rotule: string) {
    this.props.rotule = rotule
    this.touch()
  }

  set weight(weight: number) {
    this.props.weight = weight
    this.touch()
  }

  set bulk(bulk: number) {
    this.props.bulk = bulk
    this.touch()
  }

  set updatedAt(date: Date) {
    this.props.updatedAt = date
    this.touch()
  }

  // this.addDomainEvent(new MarkOrderIsColectedEvent(this))

  // METHODS

  public isCollected(deliveryId: UniqueEntityID) {
    if (this.props.state === 'waiting' && !this.props.deliveryId) {
      this.props.deliveryId = deliveryId
      this.props.state = 'collected'
      this.addDomainEvent(new MarkOrderIsColectedEvent(this))
      this.updateDateState()
    }
  }

  public isDelivered() {
    if (this.props.state === 'collected') {
      this.props.state = 'delivered'
      this.updateDateState()
      // this.addDomainEvent(new MarkOrderIsColectedEvent(this))
    }
  }

  public isReturned() {
    if (this.props.state !== 'delivered' && this.props.state === 'collected') {
      this.props.state = 'returned'
      this.updateDateState()
      // this.addDomainEvent(new MarkOrderIsColectedEvent(this))
    }
  }

  public availablePickup() {
    if (this.props.state !== 'delivered' && this.props.state === 'returned') {
      this.props.state = 'availablePickup'
      this.updateDateState()
      // this.addDomainEvent(new MarkOrderIsColectedEvent(this))
    }
  }

  private updateDateState() {
    this.props.updateAtStatus = new Date()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<OrderProps, 'createdAt' | 'state'>,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        state: props.state ?? 'waiting',
      },
      id,
    )
    return order
  }
}
