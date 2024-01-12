import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'
import { EnvService } from './env/env.service'
import { envSchema } from './env/env'
import { EnvModule } from './env/env.module'
import { ClsModule } from 'nestjs-cls'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    ClsModule.forRoot({
      global: true,
      guard: {
        mount: true,
      },
    }),
    AuthModule,
    HttpModule,
    EnvModule,
  ],
  providers: [EnvService],
})
export class AppModule {}
