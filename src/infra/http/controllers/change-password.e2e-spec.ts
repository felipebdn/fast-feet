import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { DeliverymanFatory } from 'test/factories/make-deliveryman'

describe('Create delivery man (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let deliverymanFatory: DeliverymanFatory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    deliverymanFatory = moduleRef.get(DeliverymanFatory)

    await app.init()
  })

  test('[POST] /accounts/deliveryman', async () => {
    const deliveryman = await deliverymanFatory.makePrismaDeliveryman({
      cpf: '12345678',
      name: 'Jon Doe',
      role: 'ADMIN',
      password_hash: await hash('123456', 8),
    })

    const accessToken = jwt.sign({
      sub: deliveryman.id,
      role: deliveryman.role,
    })

    const response = await request(app.getHttpServer())
      .post('/sessions/login')
      .send({
        cpf: '12345678',
        password: '123456',
      })

    expect(response.body).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
      }),
    )
  })

  test('[POST] /accounts/deliveryman error-authenticate', async () => {
    await prisma.deliveryman.create({
      data: {
        cpf: '123456789',
        name: 'Jon Doe',
        role: 'ADMIN',
        password_hash: await hash('123456', 8),
      },
    })

    const response = await request(app.getHttpServer())
      .post('/sessions/login')
      .send({
        cpf: '123456789',
        password: '12345',
      })

    expect(response.status).toBe(401)
  })
})
