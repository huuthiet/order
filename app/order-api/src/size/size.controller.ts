import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import {
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Controller,
  ValidationPipe,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import {
  CreateSizeRequestDto,
  SizeResponseDto,
  UpdateSizeRequestDto,
} from './size.dto';
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
    @Body(new ValidationPipe({ transform: true }))
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

  @HttpCode(HttpStatus.OK)
  @Patch(':slug')
  @Public()
  @ApiOperation({ summary: 'Update size' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Update size successfully',
    type: SizeResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the size to be updated',
    required: true,
    example: 'slug-123',
  })
  async updateSize(
    @Param('slug') slug: string,
    @Body(new ValidationPipe({ transform: true }))
    updateSizeDto: UpdateSizeRequestDto,
  ): Promise<SizeResponseDto> {
    return this.sizeService.updateSize(slug, updateSizeDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':slug')
  @Public()
  @ApiOperation({ summary: 'Delete size' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Delete size successfully',
    type: Number,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the size to be deleted',
    required: true,
    example: 'slug-123',
  })
  async deleteSize(@Param('slug') slug: string): Promise<number> {
    return await this.sizeService.deleteSize(slug);
  }
}
