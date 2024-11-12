import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { 
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Controller,
  ValidationPipe,
  Get
} from '@nestjs/common';

import { CreateSizeRequestDto, SizeResponseDto } from './size.dto';
import { SizeService } from './size.service';
import { Public } from 'src/auth/public.decorator';

@ApiTags('Size')
@Controller('sizes')
export class SizeController {
  constructor(
    private sizeService: SizeService
  ){}

  @HttpCode(HttpStatus.OK)
  @Post()
  @Public()
  @ApiOperation({ summary: 'Create new size' })
  @ApiResponse({ status: 200, description: 'Create new size successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createSize(
    @Body(ValidationPipe)
    requestData: CreateSizeRequestDto
  ): Promise<SizeResponseDto> {
    return this.sizeService.createSize(requestData);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all sizes' })
  @ApiResponse({ status: 200, description: 'Get all sizes successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllSizes(): Promise<SizeResponseDto[]> {
    return this.sizeService.getAllSizes();
  }
}