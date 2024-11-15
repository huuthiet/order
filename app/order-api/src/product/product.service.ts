import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { Product } from "./product.entity";
import { Repository } from "typeorm";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateProductRequestDto, ProductResponseDto, UpdateProductRequestDto } from "./product.dto";
import { CatalogService } from 'src/catalog/catalog.service';
import { VariantService } from 'src/variant/variant.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectMapper() private readonly mapper: Mapper,
    private catalogService: CatalogService,
    // private variantService: VariantService,
    @Inject(forwardRef(() => VariantService)) 
    private readonly variantService: VariantService
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

  async updateProduct(
    slug: string,
    requestData: UpdateProductRequestDto
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.findOneBy({ slug });
    if(!product) throw new BadRequestException('Product not found');

    const catalog = await this.catalogService.findOne( requestData.catalog );
    if(!catalog) throw new BadRequestException('Catalog not found');

    const productData = this.mapper.map(requestData, UpdateProductRequestDto, Product);

    Object.assign(productData, { catalog });
    Object.assign(product, productData);
    const updatedProduct = await this.productRepository.save(product);
    const productDto = this.mapper.map(updatedProduct, Product, ProductResponseDto);
    return productDto;
  }

  async deleteProduct(
    slug: string
  ): Promise<number>{
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['variants']
    });
    if(!product) throw new BadRequestException('Product not found');

    // Delete variants
    await this.variantService.deleteVariantArray(product.variants);

    const deleted = await this.productRepository.softDelete({ slug });
    return deleted.affected || 0;
  }


 async findOne(slug: string): Promise<Product | undefined>{
  return await this.productRepository.findOneBy({ slug });
 }
}