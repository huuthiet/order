import { BadRequestException, Injectable } from "@nestjs/common";
import { Product } from "./product.entity";
import { Repository } from "typeorm";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProductRequestDto, ProductResponseDto } from "./product.dto";
import { CatalogService } from 'src/catalog/catalog.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectMapper() private readonly mapper: Mapper,
    private catalogService: CatalogService,
  ) {}

  async createProduct(
    createProductDto: CreateProductRequestDto
  ): Promise<ProductResponseDto>{
    const product = await this.productRepository.findOneBy({
      name: createProductDto.name
    });
    if(product) throw new BadRequestException('Product name is existed');

    const catalog = await this.catalogService.findOne( createProductDto.catalog );
    if(!catalog) throw new BadRequestException('Catalog is not found');

    const productData = this.mapper.map(createProductDto, CreateProductRequestDto, Product);
    Object.assign(productData, { catalog });
    
    const newProduct = await this.productRepository.create(productData);
    const createdProduct = await this.productRepository.save(newProduct);
    const productDto = this.mapper.map(createdProduct, Product, ProductResponseDto);
    return productDto;
  }

  async getAllProducts(
    catalog?: string
  ): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.find({
      where: {
        catalog: {
          slug: catalog
        }
      },
      relations: [
        'catalog',
        'variants.size'
      ]
    });
    const productsDto = this.mapper.mapArray(products, Product, ProductResponseDto);
    return productsDto;
  }

 async findOne(slug: string): Promise<Product | undefined>{
  return await this.productRepository.findOneBy({ slug });
 }
}