import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface RecipientProps {
  name: string
  addressId?: string
  createdAt: Date
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  static create(
    props: Optional<RecipientProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const recipient = new Recipient(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
    return recipient
  }
}
