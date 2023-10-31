import { InMemoryDeliverymanRepository } from 'test/repositories/in-memeory-deliveryman-repository'
import { CreateDeliverymanUseCase } from './create-deliveryman'
import { makeDeliveryman } from 'test/factories/make-deliveryman'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let sut: CreateDeliverymanUseCase

describe('Create Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    sut = new CreateDeliverymanUseCase(inMemoryDeliverymanRepository)
  })
  it('should be able to create a new deliveryman', async () => {
    const deliveryman = makeDeliveryman({
      cpf: '000.000.000-41',
    })

    await sut.execute(deliveryman)

    expect(deliveryman.id).toBeTruthy()
    expect(inMemoryDeliverymanRepository.items[0].cpf).toEqual('000.000.000-41')
  })
})
