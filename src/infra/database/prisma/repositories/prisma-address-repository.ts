import { AddressRepository } from '@/domain/logistics/application/repositories/address-repository'
import { Address } from '@/domain/logistics/enterprise/entities/address'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaAddressMapper } from '../mappers/prisma-address-mapper'

@Injectable()
export class PrismaAddressRepository implements AddressRepository {
  constructor(private prisma: PrismaService) {}
  async create(address: Address) {
    await this.prisma.address.create({
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
