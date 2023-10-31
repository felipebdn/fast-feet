import { Entity } from '../../core/entities/entity'

interface DeliverymanProps {
  name: string
  cpf: string
  hash_password: string
  addressId: string
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

  get addressId() {
    return this.props.addressId
  }
}
