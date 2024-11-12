import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { 
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Controller,
  ValidationPipe,
  Get,
  Patch,
  Param
} from '@nestjs/common';

import { CreateCatalogRequestDto, CatalogResponseDto, UpdateCatalogRequestDto } from './catalog.dto';
import { CatalogService } from './catalog.service';
import { Public } from 'src/auth/public.decorator';

@ApiTags('Catalog')
@Controller('catalogs')
export class CatalogController {
  constructor(
    private catalogService: CatalogService
  ){}

  @HttpCode(HttpStatus.OK)
  @Post()
  @Public()
  @ApiOperation({ summary: 'Create new catalog' })
  @ApiResponse({ status: 200, description: 'Create new catalog successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createCatalog(
    @Body(ValidationPipe)
    requestData: CreateCatalogRequestDto
  ): Promise<CatalogResponseDto> {
    return this.catalogService.createCatalog(requestData);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all catalogs' })
  @ApiResponse({ status: 200, description: 'Get all catalogs successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getAllCatalogs(): Promise<CatalogResponseDto[]> {
    return this.catalogService.getAllCatalogs();
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':slug')
  @Public()
  @ApiOperation({ summary: 'Update catalogs' })
  @ApiResponse({ status: 200, description: 'Update catalogs successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the catalog to be updated',
    required: true,
    example: 'slug-123',
  })
  async updateCatalog(
    @Param('slug') slug: string,
    @Body(ValidationPipe) updateCatalogDto: UpdateCatalogRequestDto,
  ): Promise<CatalogResponseDto> {
    return this.catalogService.updateCatalog(
      slug,
      updateCatalogDto
    );
  }
}