import { MockType, repositoryMockFactory } from "src/test-utils/repository-mock.factory";
import { SizeService } from "./size.service";
import { Repository } from "typeorm";
import { Size } from "./size.entity";
import { Mapper } from "@automapper/core";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { mapperMockFactory } from "src/test-utils/mapper-mock.factory";
import { CreateSizeRequestDto, UpdateSizeRequestDto } from "./size.dto";
import { BadRequestException } from "@nestjs/common";
import { Variant } from "src/variant/variant.entity";
import { Product } from "src/product/product.entity";

describe('SizeService', () => {
  const mapperProvider = 'automapper:nestjs:default';
  let service: SizeService;
  let sizeRepositoryMock: MockType<Repository<Size>>;
  let mapperMock: MockType<Mapper>;

  beforeEach(async () => {
    const module : TestingModule = await Test.createTestingModule({
      providers: [
        SizeService,
        {
          provide: getRepositoryToken(Size),
          useFactory: repositoryMockFactory,
        },
        {
          provide: mapperProvider,
          useFactory: mapperMockFactory,
        }
      ]
    }).compile();

    service = module.get<SizeService>(SizeService);
    sizeRepositoryMock = module.get(getRepositoryToken(Size));
    mapperMock = module.get(mapperProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSize', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return error when size name does exists', async () => {
      const mockInput = {
        name: 'Mock size name',
        description: 'Description for size'
      } as CreateSizeRequestDto;

      const mockOutput = {
        name: "Mock size name",
        id: "mock-size-id",
        slug: "mock-size-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Size;

      (sizeRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(mockOutput);

      await expect(service.createSize(mockInput)).rejects.toThrow(BadRequestException);
    });

    it('should create success and return new size', async () => {
      const mockInput = {
        name: 'Mock size name',
        description: 'Description for size'
      } as CreateSizeRequestDto;

      const mockOutput = {
        name: "Mock size name",
        id: "mock-size-id",
        slug: "mock-size-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Size;

      (sizeRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);
      (sizeRepositoryMock.create as jest.Mock).mockResolvedValue(mockInput);
      (sizeRepositoryMock.save as jest.Mock).mockResolvedValue(mockInput);
      (mapperMock.map as jest.Mock).mockReturnValue(mockOutput);

      expect(await service.createSize(mockInput)).toEqual(mockOutput);
    });
  });

  describe('getAllSizes', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should get success and return all sizes', async () => {
      const size = {
        name: "Mock size name",
        id: "mock-size-id",
        slug: "mock-size-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Size;
      const mockOutput = [size];

      (sizeRepositoryMock.find as jest.Mock).mockResolvedValue(mockOutput);
      (mapperMock.mapArray as jest.Mock).mockReturnValue(mockOutput);
      
      expect(await service.getAllSizes()).toEqual(mockOutput);
    });
  });

  
  describe('updateSize', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error when size not found', async () => {
      const sizeSlug = 'size-slug';
      const mockInput = {
        name: 'Mock size name',
        description: 'Description for size'
      } as UpdateSizeRequestDto;

      (sizeRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(service.updateSize(sizeSlug, mockInput)).rejects.toThrow(BadRequestException);
    });

    it('should update success and return updated data', async () => {
      const sizeSlug = 'size-slug';
      const mockInput = {
        name: 'Mock size name',
        description: 'Description for size'
      } as UpdateSizeRequestDto;

      const mockOutput = {
        name: "Mock size name",
        id: "mock-size-id",
        slug: "mock-size-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      } as Size;

      (sizeRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(mockOutput);
      (mapperMock.map as jest.Mock).mockImplementationOnce(() => mockOutput);
      (sizeRepositoryMock.save as jest.Mock).mockResolvedValue(mockOutput);
      (mapperMock.map as jest.Mock).mockImplementationOnce(() => mockOutput);

      const result = await service.updateSize(sizeSlug, mockInput);
      expect(result).toEqual(mockOutput);
    });
  }); 

  describe('deleteSize', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error when size not found', async () => {
      const sizeSlug = 'size-slug';
      (sizeRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.deleteSize(sizeSlug)).rejects.toThrow(BadRequestException);
    });

    it('should throw error when size relate to variant', async () => {
      const sizeSlug = 'size-slug';
      const variant: Variant = {
        price: 0,
        size: new Size,
        product: new Product(),
        id: "mock-variant-id",
        slug: "mock-variant-slug",
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const size = {
        name: "Mock size name",
        id: "mock-size-id",
        slug: "mock-size-slug",
        createdAt: new Date(),
        updatedAt: new Date(),
        variants: [variant]
      } as Size;

      (sizeRepositoryMock.findOne as jest.Mock).mockResolvedValue(size);

      await expect(service.deleteSize(sizeSlug)).rejects.toThrow(BadRequestException);
    });

    it('should delete success and return number of deleted records', async () => {
      const sizeSlug = 'size-slug';
      const mockOutput = {
        affected: 1
      };
      const size = {
        name: "Mock size name",
        id: "mock-size-id",
        slug: "mock-size-slug",
        createdAt: new Date(),
        updatedAt: new Date(),
        variants: []
      } as Size;

      (sizeRepositoryMock.findOne as jest.Mock).mockResolvedValue(size);
      (sizeRepositoryMock.softDelete as jest.Mock).mockResolvedValue(mockOutput);

      const result = await service.deleteSize(sizeSlug);
      expect(result).toEqual(mockOutput.affected);
    });
  }); 
});