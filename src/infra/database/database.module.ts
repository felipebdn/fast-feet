import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAddressRepository } from './prisma/repositories/prisma-address-repository'
import { PrismaDeliverymanRepository } from './prisma/repositories/prisma-deliveryman-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'
import { PrismaRecipientRepository } from './prisma/repositories/prisma-recipient-repository'

@Module({
  providers: [
    PrismaService,
    PrismaAddressRepository,
    PrismaDeliverymanRepository,
    PrismaOrdersRepository,
    PrismaRecipientRepository,
  ],
  exports: [
    PrismaService,
    PrismaAddressRepository,
    PrismaDeliverymanRepository,
    PrismaOrdersRepository,
    PrismaRecipientRepository,
  ],
})
export class DatabaseModule {}
