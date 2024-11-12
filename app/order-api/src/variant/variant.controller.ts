import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VariantService } from './variant.service';
import { Public } from 'src/auth/public.decorator';
import { CreateVariantRequestDto, VariantResponseDto } from './variant.dto';

@ApiTags('Variant')
@Controller('variants')
@ApiBearerAuth()
export class VariantController {
  constructor(private variantService: VariantService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiOperation({ summary: 'Create new variant' })
  @ApiResponse({ status: 200, description: 'Create new variant successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createVariant(
    @Body(ValidationPipe)
    requestData: CreateVariantRequestDto,
  ): Promise<VariantResponseDto> {
    return this.variantService.createVariant(requestData);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all variants' })
  @ApiResponse({ status: 200, description: 'Get all variants successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllSizes(): Promise<VariantResponseDto[]> {
    return this.variantService.getAllVariants();
  }
}
