import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';

import {
  CreateSizeRequestDto,
  SizeResponseDto,
  UpdateSizeRequestDto,
} from './size.dto';
import { Size } from './size.entity';

@Injectable()
export class SizeService {
  constructor(
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  /**
   * Create a new size 
   * @param  {CreateSizeRequestDto} createSizeDto The data to create a new size
   * @returns {Promise<SizeResponseDto>} The size data is created
   */
  async createSize(
    createSizeDto: CreateSizeRequestDto,
  ): Promise<SizeResponseDto> {
    const sizeData = this.mapper.map(createSizeDto, CreateSizeRequestDto, Size);
    const size = await this.sizeRepository.findOneBy({
      name: sizeData.name,
    });
    if (size) throw new BadRequestException('Size name is existed');
    
    const newSize = this.sizeRepository.create(sizeData);
    const createdSize = await this.sizeRepository.save(newSize);
    const sizeDto = this.mapper.map(createdSize, Size, SizeResponseDto);
    return sizeDto;
  }

  /**
   * Get all sizes
   * @returns {Promise<SizeResponseDto[]>} The size array is retrieved
   */
  async getAllSizes(): Promise<SizeResponseDto[]> {
    const sizes = await this.sizeRepository.find();
    const sizesDto = this.mapper.mapArray(sizes, Size, SizeResponseDto);
    return sizesDto;
  }

  /**
   * Update size by slug
   * @param {string} slug The slug of size 
   * @param {UpdateSizeRequestDto} requestData The data to update size
   * @returns {Promise<SizeResponseDto>} The updated size
   * @throws {BadRequestException} If size is not found
   * @throws {BadRequestException} If the updated name of size that already exists
   */
  async updateSize(
    slug: string,
    requestData: UpdateSizeRequestDto,
  ): Promise<SizeResponseDto> {
    const size = await this.sizeRepository.findOneBy({ slug });
    if (!size) throw new BadRequestException('Size does not exist');
    const sizeData = this.mapper.map(requestData, UpdateSizeRequestDto, Size);
    const isExist = await this.isExistUpdatedName(sizeData.name, size.name);
    if(isExist) throw new BadRequestException('The updated name does exists');

    Object.assign(size, sizeData);
    const updatedSize = await this.sizeRepository.save(size);
    const sizeDto = this.mapper.map(updatedSize, Size, SizeResponseDto);
    return sizeDto;
  }

  /**
   * Check the updated name does exist or not
   * @param {string} updatedName The name to update for size
   * @param currentName The current name of size 
   * @returns {Promise<Boolean>} The result of checking is true or false
   */
  async isExistUpdatedName(
    updatedName: string,
    currentName: string
  ): Promise<Boolean> {
    if(updatedName === currentName) return false; 

    const sizeExist = await this.sizeRepository.findOne({
      where: { name: updatedName }
    });
    if(sizeExist) return true;
    
    return false;
  }

  /**
   * Delete size by slug
   * @param {string} slug The slug of size is deleted
   * @returns {Promise<number>} The number of sizes is deleted
   * @throws {BadRequestException} If the size is not found
   * @throws {BadRequestException} If the size have related variants
   */
  async deleteSize(slug: string): Promise<number> {
    const size = await this.sizeRepository.findOne({
      where: {
        slug,
      },
      relations: ['variants'],
    });

    if (!size) throw new BadRequestException('Size does not exist');
    if (size.variants.length > 0)
      throw new BadRequestException(
        'Must change size of variants before delete this size',
      );

    const deleted = await this.sizeRepository.softDelete({ slug });
    return deleted.affected || 0;
  }

  /**
   * Find a size by slug
   * @param {string} slug The slug of size
   * @returns {Promise<Size | null>} The size data is retrieve
   */
  async findOne(slug: string): Promise<Size | null> {
    return await this.sizeRepository.findOneBy({ slug });
  }
}
