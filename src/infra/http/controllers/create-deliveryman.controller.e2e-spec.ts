import { AppModule } from '@/infra/app.module'
import { BcryptHasher } from '@/infra/cryptography/bcrypt-hasher'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliverymanFatory } from 'test/factories/make-deliveryman'

describe('Create delivery man (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliverymanFatory: DeliverymanFatory
  let jwt: JwtService
  let bcryptHasher: BcryptHasher

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFatory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    deliverymanFatory = moduleRef.get(DeliverymanFatory)
    bcryptHasher = new BcryptHasher()

    await app.init()
  })

  test('[POST] /accounts/deliveryman', async () => {
    const delivery = await deliverymanFatory.makePrismaDeliveryman({
      cpf: '000000001',
      name: 'administrator',
      password_hash: await bcryptHasher.hash('123456'),
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
