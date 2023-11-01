import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface DeliverymanProps {
  name: string
  cpf: string
  hash_password: string
  createdAt: Date
}

export class Deliveryman extends Entity<DeliverymanProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get hash_password() {
    return this.props.hash_password
  }

  static create(
    props: Optional<DeliverymanProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const deliveryman = new Deliveryman(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
    return deliveryman
  }
}
