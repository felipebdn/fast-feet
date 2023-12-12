import { RecipientRepository } from '@/domain/logistics/application/repositories/recipient-repository'
import { Recipient } from '@/domain/logistics/enterprise/entities/recipient'
import { PrismaService } from '../prisma.service'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper'
import { Injectable } from '@nestjs/common'
import * as runtime from '@prisma/client/runtime/library'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaRecipientRepository implements RecipientRepository {
  constructor(private prisma: PrismaService) {}

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

  async create(
    recipient: Recipient,
    tx?: Omit<PrismaClient, runtime.ITXClientDenyList>,
  ): Promise<void> {
    const fn = tx ?? this.prisma
    const data = PrismaRecipientMapper.toPrisma(recipient)
    await fn.recipient.create({
      data,
    })
  }

  async save(
    recipient: Recipient,
    tx?: Omit<PrismaClient, runtime.ITXClientDenyList>,
  ): Promise<void> {
    const fn = tx ?? this.prisma
    const data = PrismaRecipientMapper.toPrisma(recipient)
    await fn.recipient.update({
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
