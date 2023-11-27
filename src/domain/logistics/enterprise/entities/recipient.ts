import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface RecipientProps {
  name: string
  addressId: UniqueEntityID
  orderId?: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  get addressId(): UniqueEntityID {
    return this.props.addressId
  }

  get orderId(): UniqueEntityID | undefined {
    return this.props.orderId
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  set name(name: string) {
    this.props.name = name
    this.props.updatedAt = new Date()
  }

  set addressId(addressId: UniqueEntityID) {
    this.props.addressId = addressId
    this.props.updatedAt = new Date()
  }

  set orderId(id: UniqueEntityID) {
    this.props.orderId = id
    this.props.updatedAt = new Date()
  }

  public touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<RecipientProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const recipient = new Recipient(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return recipient
  }
}
