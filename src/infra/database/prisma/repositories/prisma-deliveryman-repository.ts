import { DeliverymanRepository } from '@/domain/logistics/application/repositories/deliveryman-repository'
import { Deliveryman } from '@/domain/logistics/enterprise/entities/deliveryman'
import { PrismaService } from '../prisma.service'
import { PrismaDeliverymanMapper } from '../mappers/prisma-deliveryman-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaDeliverymanRepository implements DeliverymanRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const deliveryman = await this.prisma.deliveryman.findUnique({
      where: {
        id,
      },
    })
    if (!deliveryman) {
      return null
    }
    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async findByCPF(cpf: string) {
    const deliveryman = await this.prisma.deliveryman.findUnique({
      where: {
        cpf,
      },
    })
    if (!deliveryman) {
      return null
    }
    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async create(deliveryman: Deliveryman) {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)
    await this.prisma.deliveryman.create({
      data,
    })
  }

  async save(deliveryman: Deliveryman) {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)
    await this.prisma.deliveryman.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.deliveryman.delete({
      where: {
        id,
      },
    })
  }
}
