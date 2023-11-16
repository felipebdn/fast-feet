import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create delivery man (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /accounts/deliveryman', async () => {
    await prisma.deliveryman

    const response = await request(app.getHttpServer())
      .post('/accounts/deliveryman')
      .send({
        name: 'Jon Doe',
        cpf: '12345678',
        password: '123456',
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
