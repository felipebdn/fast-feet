import { Deliveryman } from '../../enterprise/entities/deliveryman'

export interface DeliverymanRepository {
  findById(id: string): Promise<Deliveryman | null>
  create(deliveryman: Deliveryman): Promise<void>
  delete(id: string): Promise<void>
}
