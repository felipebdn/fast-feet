import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Deliveryman,
  DeliverymanProps,
} from '@/domain/logistics/enterprise/entities/deliveryman'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { PrismaDeliverymanMapper } from '@/infra/database/prisma/mappers/prisma-deliveryman-mapper'

export function makeDeliveryman(
  override: Partial<DeliverymanProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryman = Deliveryman.create(
    {
      cpf: faker.phone.number(),
      hash_password: faker.internet.password(),
      name: faker.person.fullName(),
      updatedAt: undefined,
      ...override,
    },
    id,
  )

  return deliveryman
}

@Injectable()
export class DeliverymanFatory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaDeliveryman(
    data: Partial<DeliverymanProps> = {},
  ): Promise<Deliveryman> {
    const deliveryman = makeDeliveryman(data)

    await this.prismaService.deliveryman.create({
      data: PrismaDeliverymanMapper.toPrisma(deliveryman),
    })

    return deliveryman
  }
}
