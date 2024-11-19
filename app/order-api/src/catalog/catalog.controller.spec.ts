import { Test, TestingModule } from '@nestjs/testing';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { BadRequestException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import {
  CatalogResponseDto,
  CreateCatalogRequestDto,
  UpdateCatalogRequestDto,
} from './catalog.dto';

describe('CatalogController', () => {
  let controller: CatalogController;
  let service: CatalogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [
        CatalogService,
        {
          provide: CatalogService,
          useValue: {
            createCatalog: jest.fn(),
            getAllCatalogs: jest.fn(),
            updateCatalog: jest.fn(),
            deleteCatalog: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CatalogController>(CatalogController);
    service = module.get<CatalogService>(CatalogService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create catalog', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error if catalogService.createCatalog throws', async () => {
      const mockInput = {
        name: 'Mock catalog name',
        description: 'Description of catalog',
      } as CreateCatalogRequestDto;

      (service.createCatalog as jest.Mock).mockRejectedValue(
        new BadRequestException(),
      );

      await expect(controller.createCatalog(mockInput)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should return result when create success', async () => {
      const mockInput = {
        name: 'Mock catalog name',
        description: 'Description of catalog',
      } as CreateCatalogRequestDto;
      const mockOutput = {
        slug: 'mock-catalog-slug',
        name: 'Mock catalog name',
        description: 'Description of catalog',
        createdAt: (new Date()).toString(),
      } as CatalogResponseDto;

      (service.createCatalog as jest.Mock).mockResolvedValue(mockOutput);
      const result = await controller.createCatalog(mockInput);

      expect(result.result).toEqual(mockOutput);
    });
  });

  describe('Get all catalogs', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a array of catalogs', async () => {
      const catalog = {
        slug: 'mock-catalog-slug',
        name: 'Mock catalog name',
        description: 'Description of catalog',
        createdAt: (new Date()).toString(),
      } as CatalogResponseDto;
      const mockOutput = [catalog];

      (service.getAllCatalogs as jest.Mock).mockResolvedValue(mockOutput);

      const result = await controller.getAllCatalogs();
      expect(result.result).toEqual(mockOutput);
    });

    it('should return error when service.getAllCatalogs throws', async () => {
      (service.getAllCatalogs as jest.Mock).mockRejectedValue(
        new InternalServerErrorException()
      );

      await expect(controller.getAllCatalogs()).rejects.toThrow(InternalServerErrorException);
      expect(service.getAllCatalogs).toHaveBeenCalled();
    });
  });

  describe('Update catalog', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update success and return updated catalog', async () => {
      const slug: string = 'mock-catalog-slug';
      const mockInput = {
        name: 'Mock catalog name',
        description: 'The description of catalog',
      } as UpdateCatalogRequestDto;

      const mockOutput = {
        slug: 'mock-catalog-slug',
        name: 'Mock catalog name',
        description: 'The description of catalog',
        createdAt: (new Date()).toString(),
      } as CatalogResponseDto;
      (service.updateCatalog as jest.Mock).mockResolvedValue(mockOutput);

      const result = await controller.updateCatalog(slug, mockInput);
      expect(result.result).toEqual(mockOutput);
    });

    it('should throw bad request when service.updateCatalog throws', async () => {
      const slug: string = 'mock-catalog-slug';
      const updateCatalogDto = {
        name: 'Mock catalog name',
        description: 'The description of catalog',
      } as UpdateCatalogRequestDto;

      (service.updateCatalog as jest.Mock).mockRejectedValue(
        new BadRequestException()
      );

      await expect(
        controller.updateCatalog(slug, updateCatalogDto),
      ).rejects.toThrow(BadRequestException);
      expect(service.updateCatalog).toHaveBeenCalled();
    });
  });

  describe('Delete catalog', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should delete success and return number of deleted records', async () => {
      const slug: string = 'mock-catalog-slug';
      (service.deleteCatalog as jest.Mock).mockResolvedValue(1);

      const result = await controller.deleteCatalog(slug);
      expect(service.deleteCatalog).toHaveBeenCalledTimes(1);
    });

    it('should throw error when service.deleteCatalog throws', async () => {
      const slug: string = 'mock-catalog-slug';

      (service.deleteCatalog as jest.Mock).mockRejectedValue(
        new BadRequestException(),
      );

      await expect(controller.deleteCatalog(slug)).rejects.toThrow(
        BadRequestException
      );
      expect(service.deleteCatalog).toHaveBeenCalled();
    });
  });
});
