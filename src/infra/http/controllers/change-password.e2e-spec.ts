import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { compare, hash } from 'bcryptjs'
import request from 'supertest'
import { DeliverymanFatory } from 'test/factories/make-deliveryman'

describe('Change Password (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let deliverymanFatory: DeliverymanFatory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFatory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    deliverymanFatory = moduleRef.get(DeliverymanFatory)

    await app.init()
  })

  test('[POST] /sessions/reset', async () => {
    const deliveryman = await deliverymanFatory.makePrismaDeliveryman({
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

    const deliverymandb = await prisma.deliveryman.findFirstOrThrow()

    expect(response.statusCode).toEqual(204)
    expect(deliverymandb).toBeTruthy()
  })

  test('[POST] /sessions/reset password has already been used before', async () => {
    const deliveryman = await deliverymanFatory.makePrismaDeliveryman({
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
