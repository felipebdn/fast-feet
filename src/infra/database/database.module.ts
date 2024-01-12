import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import { AddressRepository } from '@/domain/logistics/application/repositories/address-repository'
import { DeliverymanRepository } from '@/domain/logistics/application/repositories/deliveryman-repository'
import { OrderRepository } from '@/domain/logistics/application/repositories/orders-repository'
import { RecipientRepository } from '@/domain/logistics/application/repositories/recipient-repository'
import { TransactionScope } from '@/domain/logistics/application/transaction/transaction-scope'

import { PrismaClientManager, PrismaService } from './prisma/prisma.service'
import { PrismaAddressRepository } from './prisma/repositories/prisma-address-repository'
import { PrismaDeliverymanRepository } from './prisma/repositories/prisma-deliveryman-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'
import { PrismaRecipientRepository } from './prisma/repositories/prisma-recipient-repository'

@Module({
  providers: [
    PrismaClientManager,
    PrismaClient,
    PrismaService,
    {
      provide: TransactionScope,
      useClass: PrismaService,
    },
    {
      provide: AddressRepository,
      useClass: PrismaAddressRepository,
    },
    {
      provide: DeliverymanRepository,
      useClass: PrismaDeliverymanRepository,
    },
    {
      provide: OrderRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: RecipientRepository,
      useClass: PrismaRecipientRepository,
    },
  ],
  exports: [
    TransactionScope,
    PrismaService,
    PrismaClientManager,
    AddressRepository,
    DeliverymanRepository,
    OrderRepository,
    RecipientRepository,
  ],
})
export class DatabaseModule {}
