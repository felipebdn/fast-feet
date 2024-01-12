import { Injectable } from '@nestjs/common'

import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrderRepository } from '@/domain/logistics/application/repositories/orders-repository'
import { Order } from '@/domain/logistics/enterprise/entities/order'

import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaOrdersRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Order) {
    const data = PrismaOrderMapper.toPrisma(order)
    await this.prisma.order.create({
      data,
    })
  }

  async save(order: Order) {
    const data = PrismaOrderMapper.toPrisma(order)
    await this.prisma.order.update({
      data,
      where: {
        id: data.id,
      },
    })
  }

  async findManyByCityAndState(
    city: string,
    state: string,
    { amount, page }: PaginationParams,
  ): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        address: {
          city,
          state,
        },
      },
      take: amount,
      skip: (page - 1) * amount,
      orderBy: {
        createdAt: 'asc',
      },
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findManyPendingById(deliveryId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        deliverymanId: deliveryId,
        status: 'collected',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findManyCompletedById(deliveryId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        deliverymanId: deliveryId,
        status: 'delivered',
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    })
    if (!order) {
      return null
    }
    return PrismaOrderMapper.toDomain(order)
  }

  async findByCode(code: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { code },
    })
    if (!order) {
      return null
    }
    return PrismaOrderMapper.toDomain(order)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.order.delete({
      where: { id },
    })
  }
}
