import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from './catalog.service';
import { Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { Catalog } from './catalog.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  CatalogResponseDto,
  CreateCatalogRequestDto,
  UpdateCatalogRequestDto,
} from './catalog.dto';
import { BadRequestException } from '@nestjs/common';
import { MockType, repositoryMockFactory } from 'src/test-utils/repository-mock.factory';
import { mapperMockFactory } from 'src/test-utils/mapper-mock.factory';
import { Product } from 'src/product/product.entity';


describe('CatalogService', () => {
  const mapperProvider = 'automapper:nestjs:default';
  let service: CatalogService;
  let catalogRepositoryMock: MockType<Repository<Catalog>>;
  let mapperMock: MockType<Mapper>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        {
          provide: getRepositoryToken(Catalog),
          useFactory: repositoryMockFactory,
        },
        {
          provide: mapperProvider,
          useFactory: mapperMockFactory,
        },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
    catalogRepositoryMock = module.get(getRepositoryToken(Catalog));
    mapperMock = module.get(mapperProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCatalog', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw an error if catalog name already exists', async () => {
      const mockInput = {
        name: 'Mock catalog name',
      } as CreateCatalogRequestDto;

      const mockOutput = {
        name: 'Mock catalog name',
        slug: 'mock-catalog-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
        id: 'mock-catalog-id',
        description: 'Description for catalog'
      } as Catalog;

      (catalogRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(mockOutput);
      await expect(service.createCatalog(mockInput)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create and return a new catalog', async () => {
      const mockInput = { 
        name: 'New Catalog',
        description: 'Description for new catalog',
      } as CreateCatalogRequestDto;
      const mockOutput = {
        id: 'mock-catalog-id',
        name: 'New Catalog',
        slug: 'mock-catalog-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Catalog;

      (catalogRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);
      (mapperMock.map as jest.Mock).mockImplementationOnce(() => mockOutput);
      (catalogRepositoryMock.create as jest.Mock).mockResolvedValue(mockOutput);
      (catalogRepositoryMock.save as jest.Mock).mockResolvedValue(mockOutput);
      (mapperMock.map as jest.Mock).mockImplementationOnce(
        () => mockOutput
      );

      const result = await service.createCatalog(mockInput);

      expect(result).toEqual(mockOutput);
    });
  });

  describe('getAllCatalogs', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should get all catalogs success', async () => {
      const catalog = {
        id: 'mock-catalog-id',
        name: 'Mock catalog name',
        slug: 'mock-catalog-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Catalog;
      const mockOutput = [catalog];

      (catalogRepositoryMock.find as jest.Mock).mockResolvedValue(mockOutput);
      (mapperMock.mapArray as jest.Mock).mockResolvedValue(mockOutput);

      const results = await service.getAllCatalogs();
      expect(results).toEqual(mockOutput);
    });
  });

  describe('updateCatalog', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should bad request when update catalog not exist', async () => {
      const slug: string = 'slug-not-found';
      const mockInput = {
        name: 'Update Catalog',
      } as UpdateCatalogRequestDto;
      (catalogRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateCatalog(slug, mockInput),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update catalog success', async () => {
      const slug: string = 'slug-catalog';
      const mockInput = {
        name: 'Update Catalog',
        description: 'description for update catalog',
      } as UpdateCatalogRequestDto;

      const mockOutput = {
        id: 'mock-catalog-slug',
        name: 'Update Catalog',
        description: 'description for update catalog',
        products: [],
        slug: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Catalog;

      (catalogRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(mockOutput);
      (mapperMock.map as jest.Mock).mockImplementationOnce(() => mockOutput);
      (catalogRepositoryMock.save as jest.Mock).mockResolvedValue(mockOutput);
      (mapperMock.map as jest.Mock).mockImplementationOnce(
        () => mockOutput
      );

      const result = await service.updateCatalog(slug, mockInput);
      expect(result).toEqual(mockOutput);
    });
  });

  describe('deleteCatalog', () => {
    it('should return bad request when catalog does not exist', async () => {
      const slug: string = 'mock-catalog-slug';
      (catalogRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteCatalog(slug)).rejects.toThrow(BadRequestException);
    });

    it('should return bad request when catalog have related product', async () => {
      const slug: string = 'slug-catalog';
      const product = {
        name: 'Product',
        isActive: false,
        isLimit: false,
        id: 'mock-product-id',
        slug: 'mock-product-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Product;

      const catalog = {
        id: 'mock-catalog-id',
        name: 'Update Catalog',
        description: 'description for update catalog',
        products: [product],
        slug: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Catalog;

      (catalogRepositoryMock.findOne as jest.Mock).mockResolvedValue(catalog);
      await expect(service.deleteCatalog(slug)).rejects.toThrow(
        'Must change catalog of products before delete this catalog',
      );
    });

    it('should return count when delete success', async () => {
      const slug: string = 'slug-catalog';
      const catalog = {
        id: 'mock-catalog-id',
        name: 'Update Catalog',
        description: 'Description for update catalog',
        slug: 'mock-catalog-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Catalog;
      const mockOutput = { affected: 1 };

      (catalogRepositoryMock.findOne as jest.Mock).mockResolvedValue(catalog);
      (catalogRepositoryMock.softDelete as jest.Mock).mockResolvedValue(mockOutput);

      const result = await service.deleteCatalog(slug);
      expect(result).toBe(mockOutput.affected);
    });
  });

  describe('findOne', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a catalog by slug', async () => {
      const slug: string = 'slug-catalog';
      const mockOutput = {
        id: 'mock-catalog-id',
        name: 'New Catalog',
        slug: 'mock-catalog-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Catalog;

      (catalogRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(mockOutput);

      const result = await service.findOne(slug);
      expect(result).toEqual(mockOutput);
    });

    it('should return null if catalog does not exist', async () => {
      const slug: string = 'slug-catalog';

      (catalogRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await service.findOne(slug);
      expect(result).toBeNull();
    });
  });
});
