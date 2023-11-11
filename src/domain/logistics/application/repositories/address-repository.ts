import { Address } from '../../enterprise/entities/address'

export abstract class AddressRepository {
  abstract findById(id: string): Promise<Address | null>
  abstract create(address: Address): Promise<void>
  abstract findManyByCityAndState(
    city: string,
    state: string,
  ): Promise<Address[]>

  abstract save(address: Address): Promise<void>
  abstract delete(id: string): Promise<void>
}
