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
  Query,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { Public } from 'src/auth/public.decorator';
import { CreateProductRequestDto, ProductResponseDto, UpdateProductRequestDto } from './product.dto';
import { ApiResponseWithType } from 'src/app/app.decorator';

@ApiTags('Product')
@Controller('products')
@ApiBearerAuth()
export class ProductController {
  constructor(private productService: ProductService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  @Public()
  @ApiOperation({ summary: 'Create new product' })
  @ApiResponse({ status: 200, description: 'Create new product successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createProduct(
    @Body(ValidationPipe)
    requestData: CreateProductRequestDto,
  ): Promise<ProductResponseDto> {
    return this.productService.createProduct(requestData);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Get all products successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiQuery({
    name: 'catalog',
    required: false,
    description: 'Filter products by catalog',
    type: String,
  })
  async getAllProducts(
    @Query('catalog') catalog: string
  ): Promise<ProductResponseDto[]> {
    return this.productService.getAllProducts(catalog);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':slug')
  @Public()
  @ApiOperation({ summary: 'Update product' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Update product successfully',
    type: ProductResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the product to be updated',
    required: true,
    example: 'slug-123',
  })
  async updateProduct(
    @Param('slug') slug: string,
    @Body(ValidationPipe) updateProductDto: UpdateProductRequestDto,
  ): Promise<ProductResponseDto> {
    return this.productService.updateProduct(
      slug,
      updateProductDto
    );
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':slug')
  @Public()
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'Delete product successfully',
    type: Number,
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @ApiParam({
    name: 'slug',
    description: 'The slug of the product to be deleted',
    required: true,
    example: 'slug-123',
  })
  async deleteProduct(
    @Param('slug') slug: string
  ): Promise<number>{
    return await this.productService.deleteProduct(slug);
  }
}
