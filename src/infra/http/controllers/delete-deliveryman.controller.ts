import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common'

import { DeleteDeliverymanUseCase } from '@/domain/logistics/application/use-cases/delete-deliveryman'
import { Authorize, JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

@Controller('/users/:id')
@UseGuards(JwtAuthGuard)
export class DeleteDeliverymanController {
  constructor(private deliveryman: DeleteDeliverymanUseCase) {}

  @Delete()
  @HttpCode(204)
  @Authorize('ADMIN')
  async handle(@Param('id') deliverymanId: string) {
    const result = await this.deliveryman.execute({ deliverymanId })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
