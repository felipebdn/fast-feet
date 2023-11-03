import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notifications', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })
  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      content: 'Conteúdo da notificação',
      recipientId: '1',
      title: 'Nova notificação',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0]).toBe(
      result.value?.notification,
    )
    expect(inMemoryNotificationsRepository.items[0]).toEqual(
      expect.objectContaining({
        recipientId: new UniqueEntityID('1'),
      }),
    )
  })
})
