import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface AddressProps {
  road: string
  complement: string
  code: string
  city: string
  state: string
  sector: string
  number?: number
  createdAt: Date
  updatedAt?: Date
}

export class Address extends Entity<AddressProps> {
  get road() {
    return this.props.road
  }

  get complement() {
    return this.props.complement
  }

  get code() {
    return this.props.code
  }

  get city() {
    return this.props.city
  }

  get state() {
    return this.props.state
  }

  get sector() {
    return this.props.sector
  }

  get number() {
    return this.props.number
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<AddressProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const address = new Address(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
    return address
  }
}
