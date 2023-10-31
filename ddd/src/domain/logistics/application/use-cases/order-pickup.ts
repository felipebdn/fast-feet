interface OrderPuckupUseCaseRequest {
  orderId: string
  deliverymanId: string
}

export class OrderPuckupUseCase {
  execute({ deliverymanId, orderId }: OrderPuckupUseCaseRequest) {}
}
