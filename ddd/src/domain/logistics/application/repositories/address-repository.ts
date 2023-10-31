import { Address } from '../../enterprise/entities/address'

export interface AddressRepository {
  create(address: Address): Promise<void>
}
