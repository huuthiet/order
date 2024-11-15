import { Test, TestingModule } from '@nestjs/testing';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import {
  CatalogResponseDto,
  CreateCatalogRequestDto,
  UpdateCatalogRequestDto,
} from './catalog.dto';
import { AppResponseDto } from 'src/app/app.dto';

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

  describe('createCatalog', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw an error if catalogService.createCatalog throws', async () => {
      const requestData: CreateCatalogRequestDto = {
        name: 'Test Catalog',
        description: 'A test catalog description',
      };

      (service.createCatalog as jest.Mock).mockRejectedValue(
        new BadRequestException('Catalog name is existed'),
      );

      await expect(controller.createCatalog(requestData)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.createCatalog).toHaveBeenCalledWith(requestData);
    });

    it('should return result when create success', async () => {
      const requestData: CreateCatalogRequestDto = {
        name: 'Test Catalog',
        description: 'A test catalog description',
      };
      const catalogDto: CatalogResponseDto = {
        slug: '123',
        name: 'Test Catalog',
        description: 'A test catalog description',
        createdAt: '',
      };

      // const expectedResponse: AppResponseDto<CatalogResponseDto> = {
      //   message: 'Catalog have been created successfully',
      //   statusCode: HttpStatus.CREATED,
      //   timestamp: new Date().toISOString(),
      //   result: catalogDto,
      // }

      (service.createCatalog as jest.Mock).mockResolvedValue(catalogDto);
      const result = await controller.createCatalog(requestData);

      expect(service.createCatalog).toHaveBeenCalledWith(requestData);
      expect(result.result).toEqual(catalogDto);
    });
  });

  describe('getAllCatalogs', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a array of catalogs', async () => {
      const expectedResponse: CatalogResponseDto[] = [
        {
          slug: '1',
          name: 'Catalog 1',
          description: 'Description 1',
          createdAt: '',
        },
        {
          slug: '2',
          name: 'Catalog 2',
          description: 'Description 2',
          createdAt: '',
        },
      ];

      (service.getAllCatalogs as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await controller.getAllCatalogs();

      expect(service.getAllCatalogs).toHaveBeenCalled();
      expect(result.result).toEqual(expectedResponse);
    });

    it('should return error when service.getAllCatalogs throws', async () => {
      (service.getAllCatalogs as jest.Mock).mockRejectedValue(
        new Error('Internal Server Error'),
      );

      await expect(controller.getAllCatalogs()).rejects.toThrow(
        'Internal Server Error',
      );
      expect(service.getAllCatalogs).toHaveBeenCalled();
    });
  });

  describe('updateCatalog', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update success and return updated catalog', async () => {
      const slug: string = 'slug-catalog';
      const updateCatalogDto: UpdateCatalogRequestDto = {
        name: 'Update Catalog',
        description: 'The description of update catalog',
      };

      const expectedResponse: CatalogResponseDto = {
        slug: '123',
        name: 'Update Catalog',
        description: 'The description of update catalog',
        createdAt: '',
      };
      (service.updateCatalog as jest.Mock).mockResolvedValue(expectedResponse);

      const result = await controller.updateCatalog(slug, updateCatalogDto);
      console.log({result})
      expect(service.updateCatalog).toHaveBeenCalled();
      expect(result.result).toEqual(expectedResponse);
    });

    it('should throw bad request when service.updateCatalog throws', async () => {
      const slug: string = 'slug-catalog';
      const updateCatalogDto: UpdateCatalogRequestDto = {
        name: 'Update Catalog',
        description: 'The description of update catalog',
      };

      (service.updateCatalog as jest.Mock).mockRejectedValue(
        new BadRequestException('Catalog does not exist'),
      );

      await expect(
        controller.updateCatalog(slug, updateCatalogDto),
      ).rejects.toThrow(BadRequestException);
      expect(service.updateCatalog).toHaveBeenCalled();
    });
  });

  describe('deleteCatalog', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should delete success and return number of deleted records', async () => {
      const slug: string = 'slug-catalog';
      (service.deleteCatalog as jest.Mock).mockResolvedValue(1);

      const result = await controller.deleteCatalog(slug);
      console.log({resultdelete: result})
      expect(service.deleteCatalog).toHaveBeenCalledWith(slug);
    });

    it('should throw error when service.updateCatalog throws', async () => {
      const slug: string = 'slug-catalog';

      (service.deleteCatalog as jest.Mock).mockRejectedValue(
        new BadRequestException('Some errors'),
      );

      await expect(controller.deleteCatalog(slug)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.deleteCatalog).toHaveBeenCalled();
    });
  });
});
