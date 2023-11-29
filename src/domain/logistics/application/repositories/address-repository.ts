import { Address } from '../../enterprise/entities/address'

export abstract class AddressRepository {
  abstract findById(id: string): Promise<Address | null>
  abstract findManyByCityAndState(
    city: string,
    state: string,
  ): Promise<Address[]>

  abstract create(address: Address, transactionId?: number): Promise<void>
  abstract save(address: Address, transactionId?: number): Promise<void>
  abstract delete(id: string, transactionId?: number): Promise<void>

  abstract createTransaction(transactionId: number): Promise<void>
  abstract commitTransaction(transactionId: number): Promise<void>
  abstract rollbackTransaction(transactionId: number): Promise<void>
}
