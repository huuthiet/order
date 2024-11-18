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
  CreateCatalogRequestDto,
  CatalogResponseDto,
  UpdateCatalogRequestDto,
} from './catalog.dto';
import { CatalogService } from './catalog.service';
import { Public } from 'src/auth/public.decorator';
import { ApiResponseWithType } from 'src/app/app.decorator';

@ApiTags('Catalog')
@Controller('catalogs')
@ApiBearerAuth()
export class CatalogController {
  constructor(private catalogService: CatalogService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiOperation({ summary: 'Create new catalog' })
  @ApiResponseWithType({
    status: HttpStatus.CREATED,
    description: 'Catalog created successfully',
    type: CatalogResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createCatalog(
    @Body(new ValidationPipe({ transform: true }))
    requestData: CreateCatalogRequestDto,
  ): Promise<CatalogResponseDto> {
    return this.catalogService.createCatalog(requestData);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all catalogs' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Get all catalogs successfully',
    type: CatalogResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllCatalogs(): Promise<CatalogResponseDto[]> {
    return this.catalogService.getAllCatalogs();
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':slug')
  @ApiOperation({ summary: 'Update catalog' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Update catalog successfully',
    type: CatalogResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the catalog to be updated',
    required: true,
    example: 'slug-123',
  })
  async updateCatalog(
    @Param('slug') slug: string,
    @Body(new ValidationPipe({ transform: true }))
    updateCatalogDto: UpdateCatalogRequestDto,
  ): Promise<CatalogResponseDto> {
    return this.catalogService.updateCatalog(slug, updateCatalogDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':slug')
  @ApiOperation({ summary: 'Delete catalog' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Delete catalog successfully',
    type: Number,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the catalog to be deleted',
    required: true,
    example: 'slug-123',
  })
  async deleteCatalog(@Param('slug') slug: string): Promise<number> {
    const s = await this.catalogService.deleteCatalog(slug);
    console.log({ s });
    return s;
  }
}
