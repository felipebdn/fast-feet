import { SpyInstance } from 'vitest'
import { makeOrder } from 'test/factories/make-order'
import { OnMarkOrderColected } from './on-mark-order-colected'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { waitFor } from 'test/utils/wait-for'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDeliveryman } from 'test/factories/make-deliveryman'

let inMemoryAddressRepository: InMemoryAddressRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sendNotificationUseCase: SendNotificationUseCase
let notificationsRepository: InMemoryNotificationsRepository

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Marl Order Colected Event', () => {
  beforeEach(() => {
    notificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      notificationsRepository,
    )
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryAddressRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnMarkOrderColected(sendNotificationUseCase)
  })

  it('should send a notification when as mark order is coleted', async () => {
    const deliveryman = makeDeliveryman()
    const order = makeOrder(
      { deliveryId: undefined },
      new UniqueEntityID('order-01'),
    )

    inMemoryOrderRepository.create(order)

    // teste is collected
    order.isCollected(deliveryman.id)

    inMemoryOrderRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })

    // teste is delivered
    order.isDelivered()

    inMemoryOrderRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })

    // teste is returned
    order.isReturned()

    inMemoryOrderRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })

    // teste is avaliable pickup
    order.availablePickup()

    inMemoryOrderRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
