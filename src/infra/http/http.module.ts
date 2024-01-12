import { Module } from '@nestjs/common'

import { AuthenticateUserUseCase } from '@/domain/logistics/application/use-cases/authenticate-user'
import { ChangePasswordUseCase } from '@/domain/logistics/application/use-cases/change-password'
import { CreateDeliverymanUseCase } from '@/domain/logistics/application/use-cases/create-deliveryman'
import { CreateOrderUseCase } from '@/domain/logistics/application/use-cases/create-order'
import { DeleteDeliverymanUseCase } from '@/domain/logistics/application/use-cases/delete-deliveryman'
import { FetchOrderSameCityUseCase } from '@/domain/logistics/application/use-cases/fetch-orders-same-city'

import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ChangePasswordController } from './controllers/change-password.controller'
import { CreateDeliverymanController } from './controllers/create-deliveryman.controller'
import { CreateOrderController } from './controllers/create-order.controller'
import { DeleteDeliverymanController } from './controllers/delete-deliveryman.controller'
import { FetchOrdersFromLocationController } from './controllers/fetch-recent-order.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateDeliverymanController,
    AuthenticateController,
    FetchOrdersFromLocationController,
    ChangePasswordController,
    DeleteDeliverymanController,
    CreateOrderController,
  ],
  providers: [
    CreateDeliverymanUseCase,
    FetchOrderSameCityUseCase,
    AuthenticateUserUseCase,
    ChangePasswordUseCase,
    DeleteDeliverymanUseCase,
    CreateOrderUseCase,
  ],
})
export class HttpModule {}
