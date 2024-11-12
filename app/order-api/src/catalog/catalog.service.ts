import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Catalog } from "./catalog.entity";
import { Repository } from "typeorm";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { CatalogResponseDto, CreateCatalogRequestDto, UpdateCatalogRequestDto } from "./catalog.dto";

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
    const newCatalog = await this.catalogRepository.create(catalogData);

    const createdCatalog = await this.catalogRepository.save(newCatalog);

    const catalogDto = this.mapper.map(createdCatalog, Catalog, CatalogResponseDto);
    return catalogDto;
  }

  async getAllCatalogs(): Promise<CatalogResponseDto[]>{
    const catalogs = await this.catalogRepository.find();
    const catalogsDto = this.mapper.mapArray(catalogs, Catalog, CatalogResponseDto);
    return catalogsDto;
  }

  async updateCatalog(
    slug: string,
    requestData: UpdateCatalogRequestDto
  ): Promise<CatalogResponseDto>{
    const catalog = await this.catalogRepository.findOneBy({ slug });
    if(!catalog) throw new BadRequestException('Catalog does not exist');

    console.log({requestData})
    const catalogData = this.mapper.map(requestData, UpdateCatalogRequestDto, Catalog);
    console.log({catalogData})
    Object.assign(catalog, catalogData);
    const updatedCatalog = await this.catalogRepository.save(catalog);
    const catalogDto = this.mapper.map(updatedCatalog, Catalog, CatalogResponseDto);
    return catalogDto;
  }

  async findOne(slug: string): Promise<Catalog | null>{
    return await this.catalogRepository.findOneBy({ slug });
  }
}