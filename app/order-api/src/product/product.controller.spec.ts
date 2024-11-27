import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import {
  CreateProductRequestDto,
  ProductResponseDto,
  UpdateProductRequestDto,
} from './product.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CatalogResponseDto } from 'src/catalog/catalog.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: ProductService,
          useValue: {
            createProduct: jest.fn(),
            getAllProducts: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create product', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error if productService.createProduct throws', async () => {
      const mockInput = {
        name: 'Mock product name',
        description: 'Description of product',
        isLimit: false,
        catalog: 'mock-catalog-slug',
      } as CreateProductRequestDto;

      (service.createProduct as jest.Mock).mockRejectedValue(
        new BadRequestException(),
      );

      await expect(controller.createProduct(mockInput)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return result when create success', async () => {
      const mockInput = {
        name: 'Mock product name',
        description: 'Description of product',
        isLimit: false,
        catalog: 'mock-catalog-slug',
      } as CreateProductRequestDto;
      const mockOutput = {
        slug: 'mock-product-slug',
        name: 'Mock product name',
        description: 'Description of product',
        createdAt: new Date().toString(),
        isActive: false,
        isLimit: false,
        catalog: new CatalogResponseDto(),
        variants: [],
      } as ProductResponseDto;

      (service.createProduct as jest.Mock).mockResolvedValue(mockOutput);
      const result = await controller.createProduct(mockInput);

      expect(result.result).toEqual(mockOutput);
    });
  });

  describe('Get all products', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a array of products', async () => {
      const catalogSlug = 'mock-catalog-slug';
      const product: ProductResponseDto = {
        slug: 'mock-product-slug',
        name: 'Mock product name',
        description: 'Description of product',
        createdAt: new Date().toString(),
        isActive: false,
        isLimit: false,
        catalog: new CatalogResponseDto(),
        variants: [],
      };
      const mockOutput = [product];

      (service.getAllProducts as jest.Mock).mockResolvedValue(mockOutput);

      const result = await controller.getAllProducts(catalogSlug);
      expect(result.result).toEqual(mockOutput);
    });

    it('should return error when service.getAllCatalogs throws', async () => {
      const catalogSlug = 'mock-catalog-slug';
      (service.getAllProducts as jest.Mock).mockRejectedValue(
        new InternalServerErrorException(),
      );

      await expect(controller.getAllProducts(catalogSlug)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(service.getAllProducts).toHaveBeenCalled();
    });
  });

  describe('Update product', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update success and return updated product', async () => {
      const slug: string = 'mock-product-slug';
      const mockInput = {
        name: 'Mock product name',
        description: 'The description of product',
        isLimit: false,
        isActive: false,
        catalog: 'mock-catalog-slug',
      } as UpdateProductRequestDto;

      const mockOutput = {
        slug: 'mock-product-slug',
        name: 'Mock product name',
        description: 'The description of product',
        createdAt: new Date().toString(),
        isActive: false,
        isLimit: false,
        catalog: new CatalogResponseDto(),
        variants: [],
      } as ProductResponseDto;
      (service.updateProduct as jest.Mock).mockResolvedValue(mockOutput);

      const result = await controller.updateProduct(slug, mockInput);
      expect(result.result).toEqual(mockOutput);
    });

    it('should throw bad request when service.updateProduct throws', async () => {
      const slug: string = 'mock-product-slug';
      const mockInput = {
        name: 'Mock product name',
        description: 'The description of product',
        isLimit: false,
        isActive: false,
        catalog: 'mock-catalog-slug',
      } as UpdateProductRequestDto;

      (service.updateProduct as jest.Mock).mockRejectedValue(
        new BadRequestException(),
      );

      await expect(controller.updateProduct(slug, mockInput)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.updateProduct).toHaveBeenCalled();
    });
  });

  describe('Delete product', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should delete success and return number of deleted records', async () => {
      const slug: string = 'mock-product-slug';
      (service.deleteProduct as jest.Mock).mockResolvedValue(1);

      const result = await controller.deleteProduct(slug);
      expect(service.deleteProduct).toHaveBeenCalledTimes(1);
    });

    it('should throw error when service.deleteProduct throws', async () => {
      const slug: string = 'mock-catalog-slug';

      (service.deleteProduct as jest.Mock).mockRejectedValue(
        new BadRequestException(),
      );

      await expect(controller.deleteProduct(slug)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.deleteProduct).toHaveBeenCalled();
    });
  });
});
