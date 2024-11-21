import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Catalog } from "./catalog.entity";
import { Repository } from "typeorm";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { CatalogResponseDto, CreateCatalogRequestDto, UpdateCatalogRequestDto } from "./catalog.dto";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Catalog)
    private readonly catalogRepository: Repository<Catalog>,
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

 /**
  * Create a new catalog
  * @param {CreateCatalogRequestDto} createCatalogDto The data to create catalog
  * @returns {Promise<CatalogResponseDto>} The created catalog
  * @throws {BadRequestException} if catalog name already exists
  */
  async createCatalog(
    createCatalogDto: CreateCatalogRequestDto
  ): Promise<CatalogResponseDto>{
    const context = `${CatalogService.name}.${this.createCatalog.name}`;
    const catalog = await this.catalogRepository.findOneBy({
      name: createCatalogDto.name
    });
    if(catalog) {
      this.logger.warn(`Catalog name ${createCatalogDto.name} does exists`, context);
      throw new BadRequestException('Catalog name does exists');
    }

    const catalogData = this.mapper.map(createCatalogDto, CreateCatalogRequestDto, Catalog);
    const newCatalog = this.catalogRepository.create(catalogData);

    const createdCatalog = await this.catalogRepository.save(newCatalog);
    this.logger.log(
      `Catalog ${createCatalogDto.name} created successfully`,
      context,
    );

    const catalogDto = this.mapper.map(createdCatalog, Catalog, CatalogResponseDto);
    return catalogDto;
  }

  /**
   * Get all catalogs
   * @returns {Promise<CatalogResponseDto[]>} Result of get all catalogs
   */
  async getAllCatalogs(): Promise<CatalogResponseDto[]>{
    const catalogs = await this.catalogRepository.find();
    const catalogsDto = this.mapper.mapArray(catalogs, Catalog, CatalogResponseDto);
    return catalogsDto;
  }

  /**
   * Update catalog by slug
   * @param {string} slug The slug of catalog is updated
   * @param {UpdateCatalogRequestDto} requestData 
   * @returns {Promise<CatalogResponseDto>} The updated catalog 
   * @throws {BadRequestException} if the catalog with the specified slug is not found
   */
  async updateCatalog(
    slug: string,
    requestData: UpdateCatalogRequestDto
  ): Promise<CatalogResponseDto>{
    const context = `${CatalogService.name}.${this.updateCatalog.name}`;
    const catalog = await this.catalogRepository.findOneBy({ slug });
    if(!catalog) {
      this.logger.warn(`Catalog ${slug} not found`, context);
      throw new BadRequestException('Catalog does not exist');
    }

    const catalogData = this.mapper.map(requestData, UpdateCatalogRequestDto, Catalog);
    Object.assign(catalog, catalogData);
    const updatedCatalog = await this.catalogRepository.save(catalog);
    this.logger.log(
      `Catalog ${slug} updated successfully`,
      context,
    );
    const catalogDto = this.mapper.map(updatedCatalog, Catalog, CatalogResponseDto);
    return catalogDto;
  }

  /**
   * Delete a catalog by slug
   * @param {string} slug The slug of catalog is deleted
   * @returns {Promise<number>} The number of record is deleted
   */
  async deleteCatalog(
    slug: string
  ): Promise<number> {
    const context = `${CatalogService.name}.${this.deleteCatalog.name}`;
    const catalog = await this.catalogRepository.findOne({
      where: { slug },
      relations: ['products']
    });
    if(!catalog) {
      this.logger.warn(`Catalog ${slug} not found`, context);
      throw new BadRequestException('Catalog does not exist');
    }
    if(catalog.products?.length > 0) {
      this.logger.warn(`Must change catalog of products before delete catalog ${slug}`, context);
      throw new BadRequestException('Must change catalog of products before delete this catalog');
    }

    const deleted = await this.catalogRepository.softDelete({ slug });
    this.logger.log(
      `Catalog ${slug} deleted successfully`,
      context,
    );
    return deleted.affected || 0;
  }

  /**
   * Find a catalog by slug
   * @param {string} slug The slug of catalog is retrieved
   * @returns {Promise<Catalog | null>} The catalog information
   */
  async findOne(slug: string): Promise<Catalog | null>{
    return await this.catalogRepository.findOneBy({ slug });
  }
}