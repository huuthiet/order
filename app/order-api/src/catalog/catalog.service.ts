import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Catalog } from "./catalog.entity";
import { Repository } from "typeorm";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { CatalogResponseDto, CreateCatalogRequestDto } from "./catalog.dto";

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Catalog)
    private readonly catalogRepository: Repository<Catalog>,
    @InjectMapper() private readonly mapper: Mapper
  ) {}

  async createCatalog(
    createCatalogDto: CreateCatalogRequestDto
  ): Promise<CatalogResponseDto>{
    const catalog = await this.catalogRepository.findOneBy({
      name: createCatalogDto.name
    });
    if(catalog) throw new BadRequestException('Catalog name is existed');

    const catalogData = this.mapper.map(createCatalogDto, CreateCatalogRequestDto, Catalog);
    console.log({catalogData})
    const newCatalog = await this.catalogRepository.create(catalogData);
    console.log({newCatalog})

    const createdCatalog = await this.catalogRepository.save(newCatalog);
    console.log({createdCatalog})

    const catalogDto = this.mapper.map(createdCatalog, Catalog, CatalogResponseDto);
    console.log({catalogDto})

    return catalogDto;
  }

  async getAllCatalogs(): Promise<CatalogResponseDto[]>{
    const catalogs = await this.catalogRepository.find();
    const catalogsDto = this.mapper.mapArray(catalogs, Catalog, CatalogResponseDto);
    return catalogsDto;
  }

  async findOne(slug: string): Promise<Catalog | undefined>{
    return await this.catalogRepository.findOneBy({ slug });
  }
}