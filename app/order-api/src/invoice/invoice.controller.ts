import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Get,
  Query,
  ValidationPipe,
  Param,
  StreamableFile,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseWithType } from 'src/app/app.decorator';
import {
  CreateInvoiceDto,
  GetSpecificInvoiceRequestDto,
  InvoiceResponseDto,
} from './invoice.dto';
import { AppResponseDto } from 'src/app/app.dto';

@Controller('invoice')
@ApiTags('Invoice')
@ApiBearerAuth()
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Invoice created successfully' })
  @ApiResponseWithType({
    status: HttpStatus.CREATED,
    description: 'Invoice created successfully',
    type: InvoiceResponseDto,
  })
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    const result = await this.invoiceService.create(createInvoiceDto);
    return {
      result,
      message: 'Invoice created successfully',
      statusCode: HttpStatus.CREATED,
      timestamp: new Date().toISOString(),
    } as AppResponseDto<InvoiceResponseDto>;
  }

  @Get('specific')
  @ApiQuery({ name: 'order', required: false })
  @ApiQuery({ name: 'slug', required: false })
  @ApiOperation({ summary: 'Get specific invoice' })
  @ApiResponseWithType({
    status: HttpStatus.CREATED,
    description: 'Invoice retrieved successfully',
    type: InvoiceResponseDto,
  })
  async getSpecificInvoice(
    @Query(new ValidationPipe({ transform: true }))
    query: GetSpecificInvoiceRequestDto,
  ) {
    const result = await this.invoiceService.getSpecificInvoice(query);
    return {
      result,
      message: 'Invoice retrieved successfully',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
    } as AppResponseDto<InvoiceResponseDto>;
  }

  @Get(':slug/export')
  @ApiOperation({ summary: 'Export invoice' })
  async exportInvoice(@Param('slug') slug: string): Promise<StreamableFile> {
    const result = await this.invoiceService.exportInvoice(slug);
    return new StreamableFile(result, {
      type: 'application/pdf',
      length: result.length,
      disposition: `attachment; filename="invoice-${new Date().toISOString()}.pdf"`,
    });
  }
}
