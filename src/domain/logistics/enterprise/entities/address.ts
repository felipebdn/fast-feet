import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AddressProps {
  street: string
  complement?: string | null
  code: string
  city: string
  state: string
  county: string
  number?: number | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Address extends Entity<AddressProps> {
  get street() {
    return this.props.street
  }

  get complement(): string | undefined | null {
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

  get county() {
    return this.props.county
  }

  get number(): number | undefined | null {
    return this.props.number
  }

  set street(street: string) {
    this.props.street = street
  }

  set complement(complement: string) {
    this.props.complement = complement
  }

  set code(code: string) {
    this.props.code = code
  }

  set city(city: string) {
    this.props.city = city
  }

  set state(state: string) {
    this.props.state = state
  }

  set county(county: string) {
    this.props.county = county
  }

  set number(number: number) {
    this.props.number = number
  }

  public touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<AddressProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const address = new Address(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
    return address
  }
}
