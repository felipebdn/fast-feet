import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controler'
import { CreateDeliverymanController } from './controllers/create-deliveryman.controller'
import { FetchOrdersFromLocationController } from './controllers/fetch-recent-order.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateDeliverymanUseCase } from '@/domain/logistics/application/use-cases/create-deliveryman'
import { FetchOrderSameCityUseCase } from '@/domain/logistics/application/use-cases/fetch-orders-same-city'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateDeliverymanController,
    AuthenticateController,
    FetchOrdersFromLocationController,
  ],
  providers: [CreateDeliverymanUseCase, FetchOrderSameCityUseCase],
})
export class HttpModule {}
