import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { UpdateStateOrderEvent } from '@/domain/logistics/enterprise/events/mark-order-colected-event'

import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnMarkOrderColected implements EventHandler {
  constructor(private sendNotificationUseCase: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendMarkOrderColectedNotification.bind(this),
      UpdateStateOrderEvent.name,
    )
  }

  private async sendMarkOrderColectedNotification({
    order,
  }: UpdateStateOrderEvent) {
    switch (order.status) {
      case 'collected':
        await this.sendNotificationUseCase.execute({
          recipientId: order.recipientId.toString(),
          content: 'Sua encomenda foi coletada',
          title: 'Pedido coletado',
        })
        break
      case 'delivered':
        await this.sendNotificationUseCase.execute({
          recipientId: order.recipientId.toString(),
          content: 'Entrega efetuada com sucesso',
          title: 'Produto entregue',
        })
        break
      case 'returned':
        await this.sendNotificationUseCase.execute({
          recipientId: order.recipientId.toString(),
          content: 'Objeto retornado para o centro de tratamento',
          title: 'Produto entregue',
        })
        break
      case 'availablePickup':
        await this.sendNotificationUseCase.execute({
          recipientId: order.recipientId.toString(),
          content: 'Objeto disponível para coleta',
          title: 'Busca disponível',
        })
        break
    }
  }
}
