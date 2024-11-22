import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreatePaymentDto,
  InitiatePaymentQRCodeResponseDto,
} from './payment.dto';
import { ApiResponseWithType } from 'src/app/app.decorator';
import { AppResponseDto } from 'src/app/app.dto';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate-qr-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate QR code' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'QR code has been initiated successfully',
    type: InitiatePaymentQRCodeResponseDto,
    isArray: true,
  })
  async initiateQRCode(
    @Body(new ValidationPipe({ transform: true }))
    createPaymentDto: CreatePaymentDto,
  ) {
    const result = await this.paymentService.initiateQRCode(createPaymentDto);
    return {
      message: 'QR code has been initiated successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<InitiatePaymentQRCodeResponseDto>;
  }
}
