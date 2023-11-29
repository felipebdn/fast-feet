import { AppModule } from '@/infra/app.module'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

describe('Delete Deliveryman (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliverymanFactory: DeliverymanFactory
  let jwt: JwtService

  beforeAll(async () => {
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

  test('[DELETE] /users/:id', async () => {
    const deliverymanAdmin = await deliverymanFactory.makePrismaDeliveryman({
      role: 'ADMIN',
    })

    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    const accessToken = jwt.sign({
      sub: deliverymanAdmin.id.toString(),
      role: deliverymanAdmin.role,
    })

    const response = await request(app.getHttpServer())
      .delete(`/users/${deliveryman.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)

    const userOnDatabase = await prisma.deliveryman.findUnique({
      where: {
        cpf: deliveryman.id.toString(),
      },
    })

    expect(response.statusCode).toBe(204)
    expect(userOnDatabase).toBeFalsy()
  })
})
