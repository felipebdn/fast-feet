import { Injectable } from '@nestjs/common'
import { AddressRepository } from '@/domain/logistics/application/repositories/address-repository'
import { Address } from '@/domain/logistics/enterprise/entities/address'
import { PrismaService } from '../prisma.service'
import { PrismaAddressMapper } from '../mappers/prisma-address-mapper'
import { PrismaClient } from '@prisma/client'
import * as runtime from '@prisma/client/runtime/library'

@Injectable()
export class PrismaAddressRepository implements AddressRepository {
  constructor(private prisma: PrismaService) {}

  async save(
    address: Address,
    tx?: Omit<PrismaClient, runtime.ITXClientDenyList>,
  ): Promise<void> {
    const fn = tx ?? this.prisma
    const data = PrismaAddressMapper.toPrisma(address)
    await fn.address.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(
    address: Address,
    tx?: Omit<PrismaClient, runtime.ITXClientDenyList>,
  ) {
    const fn = tx ?? this.prisma
    await fn.address.create({
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
