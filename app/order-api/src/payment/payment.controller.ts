import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Query,
  Get,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  CallbackUpdatePaymentStatusRequestDto,
  CreatePaymentDto,
  GetSpecificPaymentRequestDto,
  PaymentResponseDto,
} from './payment.dto';
import { ApiResponseWithType } from 'src/app/app.decorator';
import { AppResponseDto } from 'src/app/app.dto';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('specific')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate payment' })
  @ApiQuery({
    name: 'transaction',
    required: true,
    type: String,
  })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Payment has been initiated successfully',
    type: PaymentResponseDto,
    isArray: true,
  })
  async getSpecific(
    @Query(new ValidationPipe({ transform: true }))
    query: GetSpecificPaymentRequestDto,
  ) {
    const result = await this.paymentService.getSpecific(query);
    return {
      message: 'Payment has been retrieved successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<PaymentResponseDto>;
  }

  @Post('initiate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Initiate payment' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Payment has been initiated successfully',
    type: PaymentResponseDto,
    isArray: true,
  })
  async initiate(
    @Body(new ValidationPipe({ transform: true }))
    createPaymentDto: CreatePaymentDto,
  ) {
    const result = await this.paymentService.initiate(createPaymentDto);
    return {
      message: 'Payment has been initiated successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<PaymentResponseDto>;
  }

  @Post('callback/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Callback' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Callback has been processed successfully',
    type: PaymentResponseDto,
  })
  async callback(
    @Body(new ValidationPipe({ transform: true }))
    requestData: CallbackUpdatePaymentStatusRequestDto,
  ) {
    const result = await this.paymentService.callback(requestData);
    return {
      message: 'Callback has been processed successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<PaymentResponseDto>;
  }
}
