import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface RecipientProps {
  name: string
  addressId?: UniqueEntityID
  createdAt: Date
  updatedAt?: Date
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  get addressId(): UniqueEntityID | undefined {
    return this.props.addressId
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set name(name: string) {
    this.props.name = name
  }

  set addressId(addressId: UniqueEntityID) {
    this.props.addressId = addressId
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
