import { Module } from '@nestjs/common'
import { CreateDeliverymanController } from './controllers/create-deliveryman.controller'
import { FetchOrdersFromLocationController } from './controllers/fetch-recent-order.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateDeliverymanUseCase } from '@/domain/logistics/application/use-cases/create-deliveryman'
import { FetchOrderSameCityUseCase } from '@/domain/logistics/application/use-cases/fetch-orders-same-city'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateUserUseCase } from '@/domain/logistics/application/use-cases/authenticate-user'
import { ChangePasswordController } from './controllers/change-password.controller'
import { ChangePasswordUseCase } from '@/domain/logistics/application/use-cases/change-password'
import { DeleteDeliverymanController } from './controllers/delete-deliveryman.controller'
import { DeleteDeliverymanUseCase } from '@/domain/logistics/application/use-cases/delete-deliveryman'
import { AuthenticateController } from './controllers/authenticate.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateDeliverymanController,
    AuthenticateController,
    FetchOrdersFromLocationController,
    ChangePasswordController,
    DeleteDeliverymanController,
  ],
  providers: [
    CreateDeliverymanUseCase,
    FetchOrderSameCityUseCase,
    AuthenticateUserUseCase,
    ChangePasswordUseCase,
    DeleteDeliverymanUseCase,
  ],
})
export class HttpModule {}
