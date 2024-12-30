import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductAnalysisService {
  findAll() {
    return `This action returns all productAnalysis`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productAnalysis`;
  }

  remove(id: number) {
    return `This action removes a #${id} productAnalysis`;
  }
}
