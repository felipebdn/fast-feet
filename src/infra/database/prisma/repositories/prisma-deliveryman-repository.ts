import { DeliverymanRepository } from '@/domain/logistics/application/repositories/deliveryman-repository'
import { Deliveryman } from '@/domain/logistics/enterprise/entities/deliveryman'

export class PrismaDeliverymanRepository implements DeliverymanRepository {
  findById(id: string): Promise<Deliveryman | null> {
    throw new Error('Method not implemented.')
  }

  findByCPF(cpf: string): Promise<Deliveryman | null> {
    throw new Error('Method not implemented.')
  }

  create(deliveryman: Deliveryman): Promise<void> {
    throw new Error('Method not implemented.')
  }

  save(deliveryman: Deliveryman): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
