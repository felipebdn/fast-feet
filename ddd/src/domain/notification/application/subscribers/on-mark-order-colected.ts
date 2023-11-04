import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { MarkOrderIsColectedEvent } from '@/domain/logistics/enterprise/events/mark-order-colected-event'

export class OnMarkOrderColected implements EventHandler {
  constructor() {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendMarkOrderColectedNotification.bind(this),
      MarkOrderIsColectedEvent.name,
    )
  }

  private sendMarkOrderColectedNotification({
    order,
  }: MarkOrderIsColectedEvent) {
    console.log(order)
  }
}
