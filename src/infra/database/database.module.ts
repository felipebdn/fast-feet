import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAddressRepository } from './prisma/repositories/prisma-address-repository'
import { PrismaDeliverymanRepository } from './prisma/repositories/prisma-deliveryman-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'
import { PrismaRecipientRepository } from './prisma/repositories/prisma-recipient-repository'
import { AddressRepository } from '@/domain/logistics/application/repositories/address-repository'
import { DeliverymanRepository } from '@/domain/logistics/application/repositories/deliveryman-repository'
import { OrderRepository } from '@/domain/logistics/application/repositories/orders-repository'
import { RecipientRepository } from '@/domain/logistics/application/repositories/recipient-repository'
import { Transaction } from '@/domain/logistics/application/transaction/transaction'
import { UnitOfWork } from './prisma/unit-of-work'

@Module({
  providers: [
    PrismaService,
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
    {
      provide: Transaction,
      useClass: UnitOfWork,
    },
  ],
  exports: [
    PrismaService,
    AddressRepository,
    DeliverymanRepository,
    OrderRepository,
    RecipientRepository,
    Transaction,
  ],
})
export class DatabaseModule {}
