import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controler'
import { CreateDeliverymanController } from './controllers/create-deliveryman.controller'
import { FetchOrdersFromLocationController } from './controllers/fetch-recent-order.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateDeliverymanUseCase } from '@/domain/logistics/application/use-cases/create-deliveryman'
import { FetchOrderSameCityUseCase } from '@/domain/logistics/application/use-cases/fetch-orders-same-city'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateUserUseCase } from '@/domain/logistics/application/use-cases/authenticate-user'
import { ChangePasswordController } from './controllers/change-password.controller'
import { ChangePasswordUseCase } from '@/domain/logistics/application/use-cases/change-password'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateDeliverymanController,
    AuthenticateController,
    FetchOrdersFromLocationController,
    ChangePasswordController,
  ],
  providers: [
    CreateDeliverymanUseCase,
    FetchOrderSameCityUseCase,
    AuthenticateUserUseCase,
    ChangePasswordUseCase,
  ],
})
export class HttpModule {}
