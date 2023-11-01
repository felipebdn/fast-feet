import { Address } from '../../enterprise/entities/address'

export interface AddressRepository {
  findById(id: string): Promise<Address | null>
  create(address: Address): Promise<void>
  findManyByCityAndState(city: string, state: string): Promise<Address[]>
  save(address: Address): Promise<void>
  delete(id: string): Promise<void>
}
