import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";

import { CreateSizeRequestDto, SizeResponseDto, UpdateSizeRequestDto } from "./size.dto";
import { Size } from "./size.entity";
import { createAliasResolver } from "@casl/ability";


@Injectable()
export class SizeService {
  constructor(
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
    @InjectMapper() private readonly mapper: Mapper
  ){}

  async createSize(
    createSizeDto: CreateSizeRequestDto
  ): Promise<SizeResponseDto> {
    const size = await this.sizeRepository.findOneBy({
      name: createSizeDto.name
    });
    if(size) throw new BadRequestException('Size name is existed');

    const sizeData = this.mapper.map(createSizeDto, CreateSizeRequestDto, Size);
    const newSize = await this.sizeRepository.create(sizeData);
    const createdSize = await this.sizeRepository.save(newSize);
    const sizeDto = this.mapper.map(createdSize, Size, SizeResponseDto);
    return sizeDto;
  }

  async getAllSizes(): Promise<SizeResponseDto[]> {
    const sizes = await this.sizeRepository.find();
    const sizesDto = this.mapper.mapArray(sizes, Size, SizeResponseDto);
    return sizesDto;
  }

  async updateSize(
    slug: string,
    requestData: UpdateSizeRequestDto
  ): Promise<SizeResponseDto> {
    const size = await this.sizeRepository.findOneBy({ slug });
    if(!size) throw new BadRequestException('Size does not exist');

    const sizeData = this.mapper.map(requestData, UpdateSizeRequestDto, Size);
    Object.assign(size, sizeData);
    const updatedSize = await this.sizeRepository.save(size);
    const sizeDto = this.mapper.map(updatedSize, Size, SizeResponseDto);
    return sizeDto;
  }

  async deleteSize(
    slug: string
  ): Promise<number> {
    const size = await this.sizeRepository.findOne({
      where: {
        slug
      },
      relations: ['variants']
    });

    if(!size) throw new BadRequestException('Size does not exist');
    if(size.variants.length > 0)
      throw new BadRequestException('Must change size of variants before delete this size');

    const deleted = await this.sizeRepository.softDelete({ slug });
    return deleted.affected || 0;
  }

  async findOne(slug: string): Promise<Size | undefined> {
    return await this.sizeRepository.findOneBy({ slug });
  }
}