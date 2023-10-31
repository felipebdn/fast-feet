import { Entity } from '../../core/entities/entity'

interface OrderProps {
  recipientId: string
  rotule: string
  weight: number
  bulk: number
  createdAt: Date
  withdrawal?: Date
  delivery?: Date
  updateAt?: Date
}

export class Order extends Entity<OrderProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get rotule() {
    return this.props.rotule
  }

  get weight() {
    return this.props.weight
  }

  get bulk() {
    return this.props.bulk
  }

  get createdAt() {
    return this.props.createdAt
  }

  get withdrawal() {
    return this.props.withdrawal
  }

  get delivery() {
    return this.props.delivery
  }

  get updateAt() {
    return this.props.updateAt
  }
}
