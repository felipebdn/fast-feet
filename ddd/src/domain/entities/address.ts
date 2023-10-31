import { Entity } from '../../core/entities/entity'

interface AddressProps {
  road: string
  complement: string
  code: string
  city: string
  state: string
  sector: string
  number?: number
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
}
