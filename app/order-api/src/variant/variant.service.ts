import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Variant } from './variant.entity';
import { Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { SizeService } from 'src/size/size.service';
import { ProductService } from 'src/product/product.service';
import { CreateVariantRequestDto, VariantResponseDto } from './variant.dto';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectMapper() private readonly mapper: Mapper,
    private sizeService: SizeService,
    private productService: ProductService,
  ) {}

  async createVariant(
    createVariantDto: CreateVariantRequestDto,
  ): Promise<VariantResponseDto> {
    const size = await this.sizeService.findOne(createVariantDto.size);
    if (!size) throw new BadRequestException('The size is not exist');

    const product = await this.productService.findOne(createVariantDto.product);
    if (!product) throw new BadRequestException('The product is not exist');

    const variant = await this.variantRepository.findOne({
      where: {
        size: {
          slug: createVariantDto.size,
        },
        product: {
          slug: createVariantDto.product,
        },
      },
    });
    if (variant) throw new BadRequestException('The variant is existed');

    const variantData = this.mapper.map(
      createVariantDto,
      CreateVariantRequestDto,
      Variant,
    );
    Object.assign(variantData, { size, product });
    const newVariant = this.variantRepository.create(variantData);
    const createdVariant = await this.variantRepository.save(newVariant);
    const variantDto = this.mapper.map(
      createdVariant,
      Variant,
      VariantResponseDto,
    );
    return variantDto;
  }

  async getAllVariants(): Promise<VariantResponseDto[]> {
    const variants = await this.variantRepository.find({
      relations: ['size', 'product'],
    });

    const variantsDto = this.mapper.mapArray(
      variants,
      Variant,
      VariantResponseDto,
    );
    return variantsDto;
  }
}
