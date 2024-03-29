import { Injectable } from '@nestjs/common'

import { RecipientRepository } from '@/domain/logistics/application/repositories/recipient-repository'
import { Recipient } from '@/domain/logistics/enterprise/entities/recipient'

import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper'
import { PrismaClientManager, PrismaService } from '../prisma.service'

@Injectable()
export class PrismaRecipientRepository implements RecipientRepository {
  constructor(
    private prisma: PrismaService,
    private clientManager: PrismaClientManager,
  ) {}

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id,
      },
    })
    if (!recipient) {
      return null
    }
    return PrismaRecipientMapper.toDomain(recipient)
  }

  async create(recipient: Recipient, transactionKey?: string): Promise<void> {
    const prisma = this.clientManager.getClient(transactionKey)
    const data = PrismaRecipientMapper.toPrisma(recipient)
    await prisma.recipient.create({
      data,
    })
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)
    await this.prisma.recipient.update({
      data,
      where: {
        id: data.id,
      },
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.recipient.delete({
      where: {
        id,
      },
    })
  }
}
