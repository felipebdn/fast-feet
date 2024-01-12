import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

import { AppModule } from '@/infra/app.module'
import { BcryptHarsher } from '@/infra/cryptography/bcrypt-harsher'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create delivery man (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliverymanFactory: DeliverymanFactory
  let jwt: JwtService
  let bcryptHarsher: BcryptHarsher

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    bcryptHarsher = new BcryptHarsher()

    await app.init()
  })

  test('[POST] /accounts/deliveryman', async () => {
    const delivery = await deliverymanFactory.makePrismaDeliveryman({
      cpf: '000000001',
      name: 'administrator',
      password_hash: await bcryptHarsher.hash('123456'),
      role: 'ADMIN',
    })

    const accessToken = jwt.sign({
      sub: delivery.id.toString(),
      role: delivery.role,
    })

    const response = await request(app.getHttpServer())
      .post('/accounts/deliveryman')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Jon Doe',
        cpf: '12345678',
        password: '123456',
        role: 'MEMBER',
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.deliveryman.findUnique({
      where: {
        cpf: '12345678',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
