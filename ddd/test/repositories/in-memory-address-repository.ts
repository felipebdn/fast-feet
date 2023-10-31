import { AddressRepository } from '@/domain/logistics/application/repositories/address.repository'
import { Address } from '@/domain/logistics/enterprise/entities/address'

export class InMemoryAddressRepository implements AddressRepository {
  public items: Address[] = []
  async create(address: Address): Promise<void> {
    this.items.push(address)
  }
}
