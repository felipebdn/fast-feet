import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Change Password (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let deliverymanFactory: DeliverymanFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)

    await app.init()
  })

  test('[POST] /sessions/reset', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      cpf: '12345678',
      name: 'Jon Doe',
      role: 'ADMIN',
      password_hash: await hash('123456', 8),
    })

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      role: deliveryman.role,
    })

    const response = await request(app.getHttpServer())
      .put('/sessions/reset')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        deliverymanId: deliveryman.id.toString(),
        password: '1234567',
      })

    const deliverymanDb = await prisma.deliveryman.findFirstOrThrow()

    expect(response.statusCode).toEqual(204)
    expect(deliverymanDb).toBeTruthy()
  })

  test('[POST] /sessions/reset password has already been used before', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      cpf: '123456789',
      name: 'Jon Doe',
      role: 'ADMIN',
      password_hash: await hash('123456', 8),
    })

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      role: deliveryman.role,
    })

    const response = await request(app.getHttpServer())
      .put('/sessions/reset')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        deliverymanId: deliveryman.id.toString(),
        password: '123456',
      })

    expect(response.statusCode).toEqual(422)
  })
})
