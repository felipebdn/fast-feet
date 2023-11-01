import { AddressRepository } from '@/domain/logistics/application/repositories/address-repository'
import { Address } from '@/domain/logistics/enterprise/entities/address'

export class InMemoryAddressRepository implements AddressRepository {
  public items: Address[] = []

  async findById(id: string) {
    const address = this.items.find((item) => item.id.toString() === id)
    if (!address) {
      return null
    }
    return address
  }

  async create(address: Address) {
    this.items.push(address)
  }

  async save(address: Address) {
    const findIndex = this.items.findIndex((item) => item.id === address.id)
    this.items[findIndex] = address
  }

  async delete(id: string) {
    const currentIndex = this.items.findIndex(
      (item) => item.id.toString() === id,
    )
    this.items.splice(currentIndex, 1)
  }
}
