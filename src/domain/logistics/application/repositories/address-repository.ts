import { Address } from '../../enterprise/entities/address'

export abstract class AddressRepository {
  abstract findById(id: string): Promise<Address | null>
  abstract findManyByCityAndState(
    city: string,
    state: string,
  ): Promise<Address[]>

  abstract create(address: Address, transactionKey?: string): Promise<void>
  abstract save(address: Address): Promise<void>
  abstract delete(id: string): Promise<void>
}
