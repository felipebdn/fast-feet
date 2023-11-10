import { AddressRepository } from '@/domain/logistics/application/repositories/address-repository'
import { Address } from '@/domain/logistics/enterprise/entities/address'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaAddressMapper } from '../mappers/prisma-address-mapper'

@Injectable()
export class PrismaAddressRepository implements AddressRepository {
  constructor(private prisma: PrismaService) {}

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

  async create(address: Address) {
    throw new Error('Method not implemented.')
  }

  async findManyByCityAndState(city: string, state: string) {
    throw new Error('Method not implemented.')
  }

  async save(address: Address) {
    throw new Error('Method not implemented.')
  }

  async delete(id: string) {
    throw new Error('Method not implemented.')
  }
}
