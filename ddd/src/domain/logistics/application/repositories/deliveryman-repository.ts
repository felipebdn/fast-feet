import { Deliveryman } from '../../enterprise/entities/deliveryman'

export interface DeliverymanRepository {
  create(deliveryman: Deliveryman): Promise<void>
}
