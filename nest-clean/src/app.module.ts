import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateDeliverymanController } from './controllers/create-deliveryman.controller'

@Module({
  controllers: [CreateDeliverymanController],
  providers: [PrismaService],
})
export class AppModule {}
