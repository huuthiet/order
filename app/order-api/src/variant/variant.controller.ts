import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { VariantService } from './variant.service';
import { Public } from 'src/auth/public.decorator';
import { CreateVariantRequestDto, UpdateVariantRequestDto, VariantResponseDto } from './variant.dto';
import { ApiResponseWithType } from 'src/app/app.decorator';

@ApiTags('Variant')
@Controller('variants')
@ApiBearerAuth()
export class VariantController {
  constructor(private variantService: VariantService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  @Public()
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

  @HttpCode(HttpStatus.OK)
  @Patch(':slug')
  @Public()
  @ApiOperation({ summary: 'Update variant' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Update variant successfully',
    type: VariantResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the variant to be updated',
    required: true,
    example: 'slug-123',
  })
  async updateVariant(
    @Param('slug') slug: string,
    @Body(ValidationPipe) updateVariantDto: UpdateVariantRequestDto,
  ): Promise<VariantResponseDto> {
    return this.variantService.updateVariant(
      slug,
      updateVariantDto
    );
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':slug')
  @Public()
  @ApiOperation({ summary: 'Delete variant' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Delete variant successfully',
    type: Number,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the variant to be deleted',
    required: true,
    example: 'slug-123',
  })
  async deleteVariant(
    @Param('slug') slug: string
  ): Promise<number>{
    return await this.variantService.deleteVariant(slug);
  }
}
