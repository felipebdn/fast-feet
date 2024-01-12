import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

import { ReadNotificationUseCase } from './read-notification'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notifications', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })
  it('should be able to mark as read a notification', async () => {
    const notification = makeNotification(
      {
        recipientId: new UniqueEntityID('recipient-01'),
      },
      new UniqueEntityID('notification-01'),
    )

    await inMemoryNotificationsRepository.create(notification)

    expect(inMemoryNotificationsRepository.items[0].readAt).toBe(undefined)

    const result = await sut.execute({
      recipientId: 'recipient-01',
      notificationId: 'notification-01',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification(
      {
        recipientId: new UniqueEntityID('recipient-01'),
      },
      new UniqueEntityID('notification-01'),
    )

    await inMemoryNotificationsRepository.create(notification)

    expect(inMemoryNotificationsRepository.items[0].readAt).toBe(undefined)

    const result = await sut.execute({
      recipientId: 'recipient-02',
      notificationId: 'notification-01',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
