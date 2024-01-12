import { vi } from 'vitest'

import { Entity } from '../entities/entity'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

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

    return entity
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listem to events', async () => {
    const callbackSpy = vi.fn()

    // Subscribe cadastrado (ouvindo o evento de "resposta criada")
    DomainEvents.register(callbackSpy, CustomEntityCreated.name)

    // Estou criando uma reposta porém SEM salvar no canco
    const entity = CustomEntity.create()

    // Estou assegurando que o evento foi criado porém NÃO foi disparado
    expect(entity.domainEvents).toHaveLength(1)

    // Estou salvando a resposta no banco de dados e assim disparando evento
    DomainEvents.dispatchEventsForEntity(entity.id)

    // O subscriber ouve o evento e faz o que precisa ser feito com o dado
    expect(callbackSpy).toHaveBeenCalled()
    expect(entity.domainEvents).toHaveLength(0)
  })
})
