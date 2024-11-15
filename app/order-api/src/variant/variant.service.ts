import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Variant } from './variant.entity';
import { In, Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import {
  CreateVariantRequestDto,
  UpdateVariantRequestDto,
  VariantResponseDto,
} from './variant.dto';
import { Product } from 'src/product/product.entity';
import { Size } from 'src/size/size.entity';

@Injectable()
export class VariantService {
  constructor(
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
  ) {}

  /**
   * Create a new variant
   * @param {CreateVariantRequestDto} createVariantDto The data to create a new variant
   * @returns {Promise<VariantResponseDto>} The created variant data
   * @throws {BadRequestException} If the size is not found
   * @throws {BadRequestException} If the product is not found
   * @throws {BadRequestException} If the variant already exists
   */
  async createVariant(
    createVariantDto: CreateVariantRequestDto,
  ): Promise<VariantResponseDto> {
    const size = await this.sizeRepository.findOne({
      where: { slug: createVariantDto.size },
    });
    if (!size) throw new BadRequestException('The size is not exist');

    const product = await this.productRepository.findOne({
      where: { slug: createVariantDto.product },
    });
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

  /**
   * Get all variants
   * @returns {Promise<VariantResponseDto[]>} The variant array is retrieved
   */
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

  /**
   * Update variant data
   * @param {string} slug The slug of variant is updated 
   * @param {UpdateVariantRequestDto} requestData The data to update variant
   * @returns {Promise<VariantResponseDto>} The updated variant data
   * @throws {BadRequestException} If variant is not found
   */
  async updateVariant(
    slug: string,
    requestData: UpdateVariantRequestDto,
  ): Promise<VariantResponseDto> {
    const variant = await this.variantRepository.findOne({
      where: { slug },
      relations: ['size', 'product'],
    });
    if (!variant) throw new BadRequestException('Variant not found');

    Object.assign(variant, requestData);
    const updatedVariant = await this.variantRepository.save(variant);
    const variantDto = this.mapper.map(
      updatedVariant,
      Variant,
      VariantResponseDto,
    );
    return variantDto;
  }

  /**
   * Delete variant by slug
   * @param {string} slug The slug of variant is deleted
   * @returns {Promise<number>} The number of variants is deleted
   * @throws {BadRequestException} If variant is not found
   */
  async deleteVariant(slug: string): Promise<number> {
    const variant = await this.variantRepository.findOneBy({ slug });
    if (!variant) throw new BadRequestException('Variant not found');

    const deleted = await this.variantRepository.softDelete({ slug });
    return deleted.affected || 0;
  }

  /**
   * Delete variant array
   * @param {Variant[]} variants The variant array need deleted
   * @returns {Promise<number>} The number of variants is deleted
   */
  async deleteVariantArray(variants: Variant[]): Promise<number> {
    const slugList = variants.map((item) => item.slug);

    if (slugList.length < 1) return 0;

    const deleted = await this.variantRepository.softDelete({
      slug: In(slugList),
    });
    return deleted.affected;
  }
}
