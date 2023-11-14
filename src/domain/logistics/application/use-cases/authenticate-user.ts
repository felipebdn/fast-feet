import { Either, right } from '@/core/either'
import { ValueAlreadyExistsError } from '@/core/errors/errors/value-already-exists-error'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { HashCompare } from '../cryptography/hash-compare'
import { Encrypter } from '../cryptography/encrypter'

interface AuthenticateUserUseCaseRequest {
  cpf: string
  password: string
}
type AuthenticateUserUseCaseResponse = Either<ValueAlreadyExistsError, unknown>

export class AuthenticateUserUseCase {
  constructor(
    private deliveryRepository: DeliverymanRepository,
    private compare: HashCompare,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const isCPFAlreadExists = await this.deliveryRepository.findByCPF(cpf)

    return right({ isCPFAlreadExists, password })
  }
}
