import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface DeliverymanProps {
  name: string
  cpf: string
  hash_password: string
  createdAt: Date
  updatedAt?: Date | null
  role: 'MEMBER' | 'ADMIN'
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

  get updatedAt(): Date | undefined | null {
    return this.props.updatedAt
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get role() {
    return this.props.role
  }

  set name(name: string) {
    this.props.name = name
  }

  set cpf(cpf: string) {
    this.props.cpf = cpf
  }

  set role(role: 'MEMBER' | 'ADMIN') {
    this.props.role = role
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
    props: Optional<DeliverymanProps, 'createdAt' | 'role'>,
    id?: UniqueEntityID,
  ) {
    const deliveryman = new Deliveryman(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        role: props.role ?? 'MEMBER',
      },
      id,
    )
    return deliveryman
  }
}
