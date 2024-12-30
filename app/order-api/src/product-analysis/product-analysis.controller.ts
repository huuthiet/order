import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductAnalysisService } from './product-analysis.service';

@Controller('product-analysis')
export class ProductAnalysisController {
  constructor(
    private readonly productAnalysisService: ProductAnalysisService,
  ) {}

  @Get()
  findAll() {
    return this.productAnalysisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productAnalysisService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productAnalysisService.remove(+id);
  }
}
