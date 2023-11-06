import { DomainEvent } from '../events/domain-event'
import { DomainEvents } from '../events/domain-events'
import { UniqueEntityID } from './unique-entity-id'

export class Entity<Props> {
  private _id: UniqueEntityID
  public props: Props
  private _domainEvents: DomainEvent[] = []

  get id() {
    return this._id
  }

  get domainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  constructor(props: Props, id?: UniqueEntityID) {
    this.props = props
    this._id = id ?? new UniqueEntityID()
  }

  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent)
    DomainEvents.markEntityForDispatch(this)
  }

  public clearEvents() {
    this._domainEvents = []
  }

  public equals(entity: Entity<any>) {
    if (entity === this) {
      return true
    }
    if (entity.id === this._id) {
      return true
    }
    return false
  }
}
