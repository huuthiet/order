import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from './payment.dto';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(
    @Body(new ValidationPipe({ transform: true }))
    createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentService.create(createPaymentDto);
  }
}
