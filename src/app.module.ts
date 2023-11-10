import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { CreateDeliverymanController } from './controllers/create-deliveryman.controller'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controllers/authenticate.controler'
import { FetchOrdersFromLocationController } from './controllers/fetch-recent-order.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    CreateDeliverymanController,
    AuthenticateController,
    FetchOrdersFromLocationController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
