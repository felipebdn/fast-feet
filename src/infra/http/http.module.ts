import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controler'
import { CreateDeliverymanController } from './controllers/create-deliveryman.controller'
import { FetchOrdersFromLocationController } from './controllers/fetch-recent-order.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateDeliverymanUseCase } from '@/domain/logistics/application/use-cases/create-deliveryman'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateDeliverymanController,
    AuthenticateController,
    FetchOrdersFromLocationController,
  ],
  providers: [CreateDeliverymanUseCase],
})
export class HttpModule {}
