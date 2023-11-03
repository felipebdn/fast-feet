import { Entity } from '../entities/entity'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'

class CustomEntityCreated implements DomainEvent {
  public ocurredAt: Date
  private entity: CustomEntity // eslint-disable-line

  constructor(entity: CustomEntity) {
    this.entity = entity
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.entity.id
  }
}

class CustomEntity extends Entity<null> {
  static create() {
    const entity = new CustomEntity(null)

    entity.addDomainEvent(new CustomEntityCreated(entity))
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listem to events', async () => {})
})
