import { AppModule } from '@/infra/app.module'
import { BcryptHarsher } from '@/infra/cryptography/bcrypt-harsher'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

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

  test('[POST] /orders', async () => {
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
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: faker.person.fullName(),
        street: faker.location.street(),
        complement: faker.location.secondaryAddress(),
        zipCode: faker.location.zipCode(),
        city: faker.location.city(),
        state: faker.location.state(),
        county: faker.location.county(),
        number: parseInt(faker.location.buildingNumber()),
        bulk: faker.number.float({ min: 0 }),
        rotule: faker.lorem.sentence(3),
        weight: faker.number.float({ min: 0 }),
        code: 'code-01',
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.order.findUnique({
      where: {
        code: 'code-01',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
