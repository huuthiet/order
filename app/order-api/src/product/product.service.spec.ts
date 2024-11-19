import { MockType, repositoryMockFactory } from "src/test-utils/repository-mock.factory";
import { ProductService } from "./product.service";
import { Repository } from "typeorm";
import { Product } from "./product.entity";
import { Variant } from "src/variant/variant.entity";
import { Mapper } from "@automapper/core";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { mapperMockFactory } from "src/test-utils/mapper-mock.factory";
import { Catalog } from "src/catalog/catalog.entity";
import { BadRequestException } from "@nestjs/common";
import { CreateProductRequestDto, UpdateProductRequestDto } from "./product.dto";
import { Size } from "src/size/size.entity";

describe('ProductService', () => {
  const mapperProvider = 'automapper:nestjs:default';
  let service: ProductService;
  let productRepositoryMock: MockType<Repository<Product>>;
  let variantRepositoryMock: MockType<Repository<Variant>>;
  let catalogRepositoryMock: MockType<Repository<Catalog>>;
  let mapperMock: MockType<Mapper>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useFactory: repositoryMockFactory
        },
        {
          provide: getRepositoryToken(Variant),
          useFactory: repositoryMockFactory
        },
        {
          provide: getRepositoryToken(Catalog),
          useFactory: repositoryMockFactory
        },
        {
          provide: mapperProvider,
          useFactory: mapperMockFactory
        },
      ]
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepositoryMock = module.get(getRepositoryToken(Product));
    variantRepositoryMock = module.get(getRepositoryToken(Variant));
    catalogRepositoryMock = module.get(getRepositoryToken(Catalog));
    mapperMock = module.get(mapperProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  })

  describe('createProduct', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error when product name already exists', async () => {
      const mockInput: CreateProductRequestDto = {
        name: "Mock product name",
        isLimit: false,
        catalog: "mock-catalog-slug"
      };

      const product: Product = {
        name: "Mock product name",
        isActive: false,
        isLimit: false,
        catalog: new Catalog(),
        variants: [],
        menuItems: [],
        id: "mock-product-id",
        slug: "mock-product-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      };

      (productRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(product);
      await expect(service.createProduct(mockInput)).rejects.toThrow(BadRequestException);
    });

    it('should throw error when catalog is not found', async () => {
      const mockInput: CreateProductRequestDto = {
        name: "Mock product name",
        isLimit: false,
        catalog: "mock-catalog-slug"
      };

      (productRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);
      (catalogRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(service.createProduct(mockInput)).rejects.toThrow(BadRequestException);
    });

    it('should create success and return created product', async () => {
      const mockInput: CreateProductRequestDto = {
        name: "Mock product name",
        isLimit: false,
        catalog: "mock-catalog-slug"
      };

      const catalog = {
        id: 'mock-catalog-slug',
        name: 'Mock catalog name',
        description: 'description for catalog',
        slug: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Catalog;

      const mockOutput = {
        name: "Mock product name",
        isActive: false,
        isLimit: false,
        catalog: new Catalog(),
        id: "mock-product-id",
        slug: "mock-product-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Product;

      (productRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);
      (catalogRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(catalog);
      (mapperMock.map as jest.Mock).mockImplementationOnce(() => mockOutput);
      (productRepositoryMock.create as jest.Mock).mockResolvedValue(mockOutput);
      (productRepositoryMock.save as jest.Mock).mockResolvedValue(mockOutput);
      (mapperMock.map as jest.Mock).mockImplementationOnce(() => mockOutput);

      const result = await service.createProduct(mockInput);
      expect(result).toEqual(mockOutput);
    });
  });

  describe('getAllProducts', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should get all product success and return product array', async () => {
      const product = {
        name: "Mock product name",
        isActive: false,
        isLimit: false,
        catalog: new Catalog(),
        id: "mock-product-id",
        slug: "mock-product-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Product;

      const mockOutput = [product];

      (catalogRepositoryMock.find as jest.Mock).mockResolvedValue(mockOutput);
      (mapperMock.mapArray as jest.Mock).mockReturnValue(mockOutput);

      const result = await service.getAllProducts();
      expect(result).toEqual(mockOutput);
    })
  });

  describe('updateProduct', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error when product is not found', async () => {
      const productSlug = 'mock-product-slug';
      const mockInput = {
        name: "Mock product name",
        isLimit: false,
        isActive: false,
        catalog: "mock-catalog-slug"
      } as UpdateProductRequestDto;

      (productRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(service.updateProduct(productSlug, mockInput)).rejects.toThrow(BadRequestException);
    });

    it('should throw error when catalog is not found', async () => {
      const productSlug = 'mock-product-slug';
      const mockInput = {
        name: "Mock product name",
        isLimit: false,
        isActive: false,
        catalog: "mock-catalog-slug"
      } as UpdateProductRequestDto;

      const product = {
        name: "Mock product name",
        isActive: false,
        isLimit: false,
        catalog: new Catalog(),
        id: "mock-product-id",
        slug: "mock-product-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Product;

      (productRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(product);
      (catalogRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(service.updateProduct(productSlug, mockInput)).rejects.toThrow(BadRequestException);
    });

    it('should update success and return updated product', async () => {
      const productSlug = 'mock-product-slug';
      const mockInput = {
        name: "Mock product name",
        isLimit: false,
        isActive: false,
        catalog: "mock-catalog-slug"
      } as UpdateProductRequestDto;

      const mockOutput = {
        name: "Mock product name",
        isActive: false,
        isLimit: false,
        catalog: new Catalog(),
        id: "mock-product-id",
        slug: "mock-product-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Product;

      const catalog = {
        id: 'mock-catalog-slug',
        name: 'Mock catalog name',
        description: 'description for catalog',
        slug: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Catalog;

      (productRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(mockOutput);
      (catalogRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(catalog);
      (mapperMock.map as jest.Mock).mockImplementationOnce(() => mockOutput);
      (productRepositoryMock.save as jest.Mock).mockResolvedValue(mockOutput);
      (mapperMock.map as jest.Mock).mockImplementationOnce(() => mockOutput);

      const result = await service.updateProduct(productSlug, mockInput);
      expect(result).toEqual(mockOutput);
    });
  });

  describe('deleteProduct', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('it should throw error when product is not found', async () => {
      const productSlug = 'mock-product-slug';
      (productRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteProduct(productSlug)).rejects.toThrow(BadRequestException);
    });

    it('it should delete success', async () => {
      const productSlug = 'mock-product-slug';
      const variant: Variant = {
        price: 0,
        size: new Size(),
        product: new Product(),
        id: "mock-variant-id",
        slug: "mock-variant-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const product = {
        name: "Mock product name",
        isActive: false,
        isLimit: false,
        catalog: new Catalog(),
        id: "mock-product-id",
        slug: "mock-product-slug",
        variants: [variant],
        createdAt: new Date(),
        updatedAt: new Date()
      } as Product;
      const mockOutput = { affected: 1};

      (productRepositoryMock.findOne as jest.Mock).mockResolvedValue(product);
      (productRepositoryMock.softDelete as jest.Mock).mockResolvedValue(mockOutput);
      jest.spyOn(service, 'deleteVariantsRelatedProduct').mockResolvedValue(undefined);

      const result = await service.deleteProduct(productSlug);
      expect(result).toEqual(mockOutput.affected);
      expect(service.deleteVariantsRelatedProduct).toHaveBeenCalled();
    });
  });

  describe('deleteVariantsRelatedProduct', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should not perform deletion when variant array is empty', async () => {
      const mockInput = [] as Variant[];
      expect(await service.deleteVariantsRelatedProduct(mockInput)).toEqual(undefined);
      expect(variantRepositoryMock.softDelete).not.toHaveBeenCalled();
    });

    it('should not perform deletion when variant array is not empty', async () => {
      const variant: Variant = {
        price: 0,
        size: new Size(),
        product: new Product(),
        id: "mock-variant-id",
        slug: "mock-variant-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const mockInput = [variant];
      (variantRepositoryMock.softDelete as jest.Mock).mockResolvedValue(undefined);
      expect(await service.deleteVariantsRelatedProduct(mockInput)).toEqual(undefined);
      expect(variantRepositoryMock.softDelete).toHaveBeenCalled();
    });
  })
})