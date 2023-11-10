import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface DeliverymanProps {
  addressId: UniqueEntityID
  name: string
  cpf: string
  hash_password: string
  createdAt: Date
  updatedAt?: Date
}

export class Deliveryman extends Entity<DeliverymanProps> {
  get addressId() {
    return this.props.addressId
  }

  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get hash_password() {
    return this.props.hash_password
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  set addressId(id: UniqueEntityID) {
    this.props.addressId = id
  }

  set name(name: string) {
    this.props.name = name
  }

  set cpf(cpf: string) {
    this.props.cpf = cpf
  }

  set hash_password(hashPassword: string) {
    this.props.hash_password = hashPassword
  }

  set updatedAt(date: Date) {
    this.props.updatedAt = date
  }

  public touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<DeliverymanProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const deliveryman = new Deliveryman(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return deliveryman
  }
}
