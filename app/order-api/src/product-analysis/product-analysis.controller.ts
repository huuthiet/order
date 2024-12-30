import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ProductAnalysisService } from './product-analysis.service';
import { Public } from 'src/auth/public.decorator';
import { ApiResponseWithType } from 'src/app/app.decorator';
import { ProductAnalysisResponseDto } from './product-analysis.dto';
import { ApiOperation } from '@nestjs/swagger';
import { AppResponseDto } from 'src/app/app.dto';

@Controller('product-analysis')
export class ProductAnalysisController {
  constructor(
    private readonly productAnalysisService: ProductAnalysisService,
  ) {}

  @Get('top-sell')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'The top-sellers product were retrieved successfully.',
    type: ProductAnalysisResponseDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'Get top-sell products' })
  async getTopSellProducts(): Promise<
    AppResponseDto<ProductAnalysisResponseDto[]>
  > {
    const result = await this.productAnalysisService.getTopSellProducts();
    return {
      message: 'The top-sellers product were retrieved successfully.',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<ProductAnalysisResponseDto[]>;
  }

  @Get('top-sell/branch/:branch')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiResponseWithType({
    status: HttpStatus.OK,
    description: 'The top-sellers product were retrieved successfully.',
    type: ProductAnalysisResponseDto,
    isArray: true,
  })
  @ApiOperation({ summary: 'Get top-sell products by branch' })
  async getTopSellProductsByBranch(
    @Param('branch') branchSlug: string,
  ): Promise<AppResponseDto<ProductAnalysisResponseDto[]>> {
    const result =
      await this.productAnalysisService.getTopSellProductsByBranch(branchSlug);
    return {
      message: 'The top-sellers product were retrieved successfully.',
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      result,
    } as AppResponseDto<ProductAnalysisResponseDto[]>;
  }
}
