import { Injectable } from '@nestjs/common'

import { AddressRepository } from '@/domain/logistics/application/repositories/address-repository'
import { Address } from '@/domain/logistics/enterprise/entities/address'

import { PrismaAddressMapper } from '../mappers/prisma-address-mapper'
import { PrismaClientManager, PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAddressRepository implements AddressRepository {
  constructor(
    private prisma: PrismaService,
    private clientManager: PrismaClientManager,
  ) {}

  async create(address: Address, transactionKey?: string) {
    const prisma = this.clientManager.getClient(transactionKey)
    await prisma.address.create({
      data: PrismaAddressMapper.toPrisma(address),
    })
  }

  async findManyByCityAndState(
    city: string,
    state: string,
  ): Promise<Address[]> {
    const locals = await this.prisma.address.findMany({
      where: {
        city,
        state,
      },
    })
    return locals.map(PrismaAddressMapper.toDomain)
  }

  async save(address: Address): Promise<void> {
    const data = PrismaAddressMapper.toPrisma(address)
    await this.prisma.address.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.address.delete({
      where: {
        id,
      },
    })
  }

  async findById(id: string) {
    const address = await this.prisma.address.findUnique({
      where: {
        id,
      },
    })
    if (!address) {
      return null
    }
    return PrismaAddressMapper.toDomain(address)
  }
}
