import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Controller,
  ValidationPipe,
  Get,
} from '@nestjs/common';

import { CreateSizeRequestDto, SizeResponseDto } from './size.dto';
import { SizeService } from './size.service';
import { Public } from 'src/auth/public.decorator';
import { ApiResponseWithType } from 'src/app/app.decorator';

@ApiTags('Size')
@Controller('sizes')
@ApiBearerAuth()
export class SizeController {
  constructor(private sizeService: SizeService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiOperation({ summary: 'Create new size' })
  @ApiResponseWithType({
    status: HttpStatus.CREATED,
    description: 'Create new size successfully',
    type: SizeResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createSize(
    @Body(ValidationPipe)
    requestData: CreateSizeRequestDto,
  ): Promise<SizeResponseDto> {
    return this.sizeService.createSize(requestData);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all sizes' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Sizes retrieved successfully',
    type: SizeResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllSizes(): Promise<SizeResponseDto[]> {
    return this.sizeService.getAllSizes();
  }
}
