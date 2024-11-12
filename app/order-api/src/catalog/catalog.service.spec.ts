import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from './catalog.service';
import { Repository } from 'typeorm';
import { Mapper } from '@automapper/core';
import { Catalog } from './catalog.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CatalogResponseDto, CreateCatalogRequestDto } from './catalog.dto';
import { BadRequestException } from '@nestjs/common';

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
          useValue: mockCatalogRepository
        },
        {
          // provide: Mapper,
          provide: 'automapper:nestjs:default',
          useValue: mockMapper,
        },
      ]
    }).compile();

    service = module.get<CatalogService>(CatalogService);
    catalogRepository = module.get<Repository<Catalog>>(getRepositoryToken(Catalog));
    mapper = module.get('automapper:nestjs:default');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCatalog', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw an error if catalog name already exists', async () => {
      const createCatalogDto: CreateCatalogRequestDto = { name: 'Existing Catalog' };

      (catalogRepository.findOneBy as jest.Mock).mockResolvedValue({
        id: '17b0df8f-7af3-45d1-8615-efebc08e7d12',
        name: 'Existing Catalog'
      } as Catalog);  
      await expect(service.createCatalog(createCatalogDto)).rejects.toThrow(BadRequestException);
    });

    it('should create and return a new catalog', async () => {
      const createCatalogDto: CreateCatalogRequestDto = { name: 'New Catalog' };
      const catalogData = {
        name: 'New Catalog',
        description: 'description for new catalog'
      };
      const newCatalog = {
        name: 'New Catalog',
        description: 'description for new catalog'
      };
      const createdCatalog: Catalog = {
        id: '17b0df8f-7af3-45d1-8615-efebc08e7d12',
        name: 'New Catalog',
        products: [],
        slug: '',
        createdAt: undefined,
        updatedAt: undefined
      };
      const catalogResponseDto: CatalogResponseDto = {
        slug: 'efebc08e7d12',
        name: 'New Catalog',
        createdAt: '',
        updatedAt: ''
      };

      (catalogRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      (mapper.map as jest.Mock).mockImplementationOnce(
        () => catalogData
      );
      (catalogRepository.create as jest.Mock).mockResolvedValue(newCatalog);
      (catalogRepository.save as jest.Mock).mockResolvedValue(createdCatalog);
      (mapper.map as jest.Mock).mockImplementationOnce(
        () => catalogResponseDto
      );

      const result = await service.createCatalog(createCatalogDto);

      expect(catalogRepository.findOneBy).toHaveBeenCalledWith({ name: 'New Catalog' });
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

    it('should get all catalogs success', async () =>{
      const catalogs: Catalog[] = [
        {
          id: '17b0df8f-7af3-45d1-8615-efebc08e7d12',
          name: 'New Catalog',
          products: [],
          slug: '',
          createdAt: undefined,
          updatedAt: undefined
        }
      ];
      const catalogsDto: CatalogResponseDto[] = [
        {
          slug: 'efebc08e7d12',
          name: 'New Catalog',
          createdAt: '',
          updatedAt: ''
        }
      ];

      (catalogRepository.find as jest.Mock).mockResolvedValue(catalogs);
      (mapper.mapArray as jest.Mock).mockResolvedValue(catalogsDto);

      const results = await service.getAllCatalogs();

      expect(catalogRepository.find).toHaveBeenCalled();
      expect(mapper.mapArray).toHaveBeenCalledWith(
        catalogs,
        Catalog,
        CatalogResponseDto
      );
      expect(results).toEqual(catalogsDto);
    });
  });

  describe('findOne', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a catalog by slug', async () => {
      const slug : string = 'slug-catalog';
      const catalog: Catalog = {
        id: '17b0df8f-7af3-45d1-8615-efebc08e7d12',
        name: 'New Catalog',
        products: [],
        slug: '',
        createdAt: undefined,
        updatedAt: undefined
      };

      (catalogRepository.findOneBy as jest.Mock).mockResolvedValue(catalog);

      const result = await service.findOne(slug);

      expect(catalogRepository.findOneBy).toHaveBeenCalledWith({ slug });
      expect(result).toEqual(catalog);
    });

    it('should return null if catalog does not exist', async () => {
      const slug : string = 'slug-catalog';

      (catalogRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      const result = await service.findOne(slug);

      expect(catalogRepository.findOneBy).toHaveBeenCalledWith({ slug });
      expect(result).toBeNull();
    });
  });
})