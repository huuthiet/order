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
import { MAPPER_MODULE_PROVIDER } from 'src/app/app.constants';

describe('CatalogService', () => {
  let service: CatalogService;
  let catalogRepository: Repository<Catalog>;
  let mapper: Mapper;

  beforeEach(async () => {
    const mockCatalogRepository = {
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      softDelete: jest.fn(),
    };

    const mockMapper = {
      map: jest.fn(),
      mapArray: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        {
          provide: getRepositoryToken(Catalog),
          useValue: mockCatalogRepository,
        },
        {
          provide: MAPPER_MODULE_PROVIDER,
          useValue: mockMapper,
        },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
    catalogRepository = module.get<Repository<Catalog>>(
      getRepositoryToken(Catalog),
    );
    mapper = module.get(MAPPER_MODULE_PROVIDER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCatalog', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw an error if catalog name already exists', async () => {
      const createCatalogDto: CreateCatalogRequestDto = {
        name: 'Existing Catalog',
      };

      (catalogRepository.findOneBy as jest.Mock).mockResolvedValue({
        id: '17b0df8f-7af3-45d1-8615-efebc08e7d12',
        name: 'Existing Catalog',
      } as Catalog);
      await expect(service.createCatalog(createCatalogDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create and return a new catalog', async () => {
      const createCatalogDto: CreateCatalogRequestDto = { name: 'New Catalog' };
      const catalogData = {
        name: 'New Catalog',
        description: 'description for new catalog',
      };
      const newCatalog = {
        name: 'New Catalog',
        description: 'description for new catalog',
      };
      const createdCatalog: Catalog = {
        id: '17b0df8f-7af3-45d1-8615-efebc08e7d12',
        name: 'New Catalog',
        products: [],
        slug: '',
        createdAt: undefined,
        updatedAt: undefined,
      };
      const catalogResponseDto: CatalogResponseDto = {
        slug: 'efebc08e7d12',
        name: 'New Catalog',
        createdAt: '',
      };

      (catalogRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      (mapper.map as jest.Mock).mockImplementationOnce(() => catalogData);
      (catalogRepository.create as jest.Mock).mockResolvedValue(newCatalog);
      (catalogRepository.save as jest.Mock).mockResolvedValue(createdCatalog);
      (mapper.map as jest.Mock).mockImplementationOnce(
        () => catalogResponseDto,
      );

      const result = await service.createCatalog(createCatalogDto);

      expect(catalogRepository.findOneBy).toHaveBeenCalledWith({
        name: 'New Catalog',
      });
      expect(catalogRepository.create).toHaveBeenCalledWith(catalogData);
      expect(catalogRepository.save).toHaveBeenCalledWith(newCatalog);
      expect(mapper.map).toHaveBeenCalledTimes(2);
      expect(result).toEqual(catalogResponseDto);
    });
  });

  describe('getAllCatalogs', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should get all catalogs success', async () => {
      const catalogs: Catalog[] = [
        {
          id: '17b0df8f-7af3-45d1-8615-efebc08e7d12',
          name: 'New Catalog',
          products: [],
          slug: '',
          createdAt: undefined,
          updatedAt: undefined,
        },
      ];
      const catalogsDto: CatalogResponseDto[] = [
        {
          slug: 'efebc08e7d12',
          name: 'New Catalog',
          createdAt: '',
        },
      ];

      (catalogRepository.find as jest.Mock).mockResolvedValue(catalogs);
      (mapper.mapArray as jest.Mock).mockResolvedValue(catalogsDto);

      const results = await service.getAllCatalogs();

      expect(catalogRepository.find).toHaveBeenCalled();
      expect(mapper.mapArray).toHaveBeenCalledWith(
        catalogs,
        Catalog,
        CatalogResponseDto,
      );
      expect(results).toEqual(catalogsDto);
    });
  });

  describe('updateCatalog', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should bad request when update catalog not exist', async () => {
      const slug: string = 'slug-not-found';
      const updateCatalogDto: UpdateCatalogRequestDto = {
        name: 'Update Catalog',
      };
      (catalogRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateCatalog(slug, updateCatalogDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('Should update catalog success', async () => {
      const slug: string = 'slug-catalog';
      const requestData: UpdateCatalogRequestDto = {
        name: 'Update Catalog',
        description: 'description for update catalog',
      };
      const catalog: Catalog = {
        id: '17b0df8f-7af3-45d1-8615-efebc08e7d12',
        name: 'Catalog',
        products: [],
        slug: '',
        createdAt: undefined,
        updatedAt: undefined,
      };
      const catalogData = {
        name: 'Update Catalog',
        description: 'description for update catalog',
      };
      const updatedCatalog: Catalog = {
        id: '17b0df8f-7af3-45d1-8615-efebc08e7d12',
        name: 'Update Catalog',
        description: 'description for update catalog',
        products: [],
        slug: '',
        createdAt: undefined,
        updatedAt: undefined,
      };
      const catalogResponseDto: CatalogResponseDto = {
        slug: 'efebc08e7d12',
        name: 'Update Catalog',
        description: 'description for update catalog',
        createdAt: '',
      };

      (catalogRepository.findOneBy as jest.Mock).mockResolvedValue(catalog);
      (mapper.map as jest.Mock).mockImplementationOnce(() => catalogData);
      (catalogRepository.save as jest.Mock).mockResolvedValue(catalog);
      (mapper.map as jest.Mock).mockImplementationOnce(
        () => catalogResponseDto,
      );

      const result = await service.updateCatalog(slug, requestData);

      expect(catalogRepository.findOneBy).toHaveBeenCalledWith({ slug });
      expect(mapper.map).toHaveBeenCalledWith(
        requestData,
        UpdateCatalogRequestDto,
        Catalog,
      );
      expect(catalogRepository.save).toHaveBeenCalledWith(catalog);
      expect(mapper.map).toHaveBeenCalledWith(
        updatedCatalog,
        Catalog,
        CatalogResponseDto,
      );
      expect(mapper.map).toHaveBeenCalledTimes(2);
      expect(result).toEqual(catalogResponseDto);
    });
  });

  describe('deleteCatalog', () => {
    it('should return bad request when catalog does not exist', async () => {
      const slug: string = 'slug-not-exist';
      (catalogRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteCatalog(slug)).rejects.toThrow(
        BadRequestException,
      );
      expect(catalogRepository.findOne).toHaveBeenCalledWith({
        where: { slug },
        relations: ['products'],
      });
    });

    it('should return bad request when catalog have related product', async () => {
      const slug: string = 'slug-catalog';
      const catalog: Catalog = {
        id: '17b0df8f-7af3-45d1-8615-efebc08e7d12',
        name: 'Update Catalog',
        description: 'description for update catalog',
        products: [
          {
            name: 'Product',
            isActive: false,
            isLimit: false,
            catalog: new Catalog(),
            variants: [],
            id: '',
            slug: '',
            createdAt: undefined,
            updatedAt: undefined,
            menuItems: [],
          },
        ],
        slug: '',
        createdAt: undefined,
        updatedAt: undefined,
      };

      (catalogRepository.findOne as jest.Mock).mockResolvedValue(catalog);
      await expect(service.deleteCatalog(slug)).rejects.toThrow(
        'Must change catalog of products before delete this catalog',
      );
    });

    it('should return count when delete success', async () => {
      const slug: string = 'slug-catalog';
      const catalog: Catalog = {
        id: '17b0df8f-7af3-45d1-8615-efebc08e7d12',
        name: 'Update Catalog',
        description: 'description for update catalog',
        products: [],
        slug: '',
        createdAt: undefined,
        updatedAt: undefined,
      };
      const deleteResult = { affected: 1 };

      (catalogRepository.findOne as jest.Mock).mockResolvedValue(catalog);
      (catalogRepository.softDelete as jest.Mock).mockResolvedValue(
        deleteResult,
      );

      const result = await service.deleteCatalog(slug);

      expect(catalogRepository.findOne).toHaveBeenCalledWith({
        where: { slug },
        relations: ['products'],
      });
      expect(catalogRepository.softDelete).toHaveBeenCalledWith({ slug });
      expect(result).toBe(deleteResult.affected);
    });
  });

  describe('findOne', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a catalog by slug', async () => {
      const slug: string = 'slug-catalog';
      const catalog: Catalog = {
        id: '17b0df8f-7af3-45d1-8615-efebc08e7d12',
        name: 'New Catalog',
        products: [],
        slug: '',
        createdAt: undefined,
        updatedAt: undefined,
      };

      (catalogRepository.findOneBy as jest.Mock).mockResolvedValue(catalog);

      const result = await service.findOne(slug);

      expect(catalogRepository.findOneBy).toHaveBeenCalledWith({ slug });
      expect(result).toEqual(catalog);
    });

    it('should return null if catalog does not exist', async () => {
      const slug: string = 'slug-catalog';

      (catalogRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await service.findOne(slug);

      expect(catalogRepository.findOneBy).toHaveBeenCalledWith({ slug });
      expect(result).toBeNull();
    });
  });
});
