import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { MarkOrderIsColectedEvent } from '@/domain/logistics/enterprise/events/mark-order-colected-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnMarkOrderColected implements EventHandler {
  constructor(private sendNotificationUseCase: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendMarkOrderColectedNotification.bind(this),
      MarkOrderIsColectedEvent.name,
    )
  }

  private async sendMarkOrderColectedNotification({
    order,
  }: MarkOrderIsColectedEvent) {
    await this.sendNotificationUseCase.execute({
      recipientId: order.recipientId.toString(),
      content: 'Sua encomenda foi coletada',
      title: 'Pedido coletado',
    })
  }
}
