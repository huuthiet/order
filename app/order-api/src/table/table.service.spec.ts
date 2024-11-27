import { Test, TestingModule } from '@nestjs/testing';
import { TableService } from './table.service';
import {
  MockType,
  repositoryMockFactory,
} from 'src/test-utils/repository-mock.factory';
import { Repository } from 'typeorm';
import { Table } from './table.entity';
import { Branch } from 'src/branch/branch.entity';
import { Mapper } from '@automapper/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mapperMockFactory } from 'src/test-utils/mapper-mock.factory';
import { CreateTableRequestDto, UpdateTableRequestDto } from './table.dto';
import { BadRequestException } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MAPPER_MODULE_PROVIDER } from 'src/app/app.constants';
import { RobotConnectorClient } from 'src/robot-connector/robot-connector.client';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('TableService', () => {
  let service: TableService;
  let tableRepositoryMock: MockType<Repository<Table>>;
  let branchRepositoryMock: MockType<Repository<Branch>>;
  let mapperMock: MockType<Mapper>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TableService,
        RobotConnectorClient,
        HttpService,
        {
          provide: 'AXIOS_INSTANCE_TOKEN',
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'SALT_ROUNDS') {
                return 10;
              }
              return null;
            }),
          },
        },
        {
          provide: getRepositoryToken(Table),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Branch),
          useFactory: repositoryMockFactory,
        },
        {
          provide: MAPPER_MODULE_PROVIDER,
          useFactory: mapperMockFactory,
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: console,
        },
      ],
    }).compile();

    service = module.get<TableService>(TableService);
    tableRepositoryMock = module.get(getRepositoryToken(Table));
    branchRepositoryMock = module.get(getRepositoryToken(Branch));
    mapperMock = module.get(MAPPER_MODULE_PROVIDER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create table', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error when branch is not found', async () => {
      const mockInput = {
        name: 'Mock table name',
        branch: 'mock-branch-slug',
        location: 'mock-location-abfA',
      } as CreateTableRequestDto;

      (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(service.create(mockInput)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error when name of table already exist at this branch', async () => {
      const mockInput = {
        name: 'Mock table name',
        branch: 'mock-branch-slug',
        location: 'mock-location-abfA',
      } as CreateTableRequestDto;
      const branch = {
        name: 'Mock branch name',
        address: 'Mock branch address',
        id: 'mock-branch-id',
        slug: 'mock-branch-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Branch;
      const mockOutput = {
        name: 'Mock table name',
        branch: new Branch(),
        id: 'mock-table-id',
        slug: 'mock-table-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Table;

      (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(branch);
      (mapperMock.map as jest.Mock).mockReturnValue(mockOutput);
      (tableRepositoryMock.findOne as jest.Mock).mockResolvedValue(mockOutput);

      await expect(service.create(mockInput)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create success and return created table', async () => {
      const mockInput = {
        name: 'Mock table name',
        branch: 'mock-branch-slug',
        location: 'mock-location-abfA',
      } as CreateTableRequestDto;
      const branch = {
        name: 'Mock branch name',
        address: 'Mock branch address',
        id: 'mock-branch-id',
        slug: 'mock-branch-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Branch;
      const mockOutput = {
        name: 'Mock table name',
        branch: new Branch(),
        id: 'mock-table-id',
        slug: 'mock-table-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Table;

      (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(branch);
      (mapperMock.map as jest.Mock).mockImplementationOnce(() => mockOutput);
      (tableRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);
      (tableRepositoryMock.create as jest.Mock).mockReturnValue(mockOutput);
      (tableRepositoryMock.save as jest.Mock).mockResolvedValue(mockOutput);
      (mapperMock.map as jest.Mock).mockImplementationOnce(() => mockOutput);

      const result = await service.create(mockInput);
      expect(result).toEqual(mockOutput);
      expect(mapperMock.map).toHaveBeenCalledTimes(2);
    });
  });

  describe('Get all tables by branch', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error when branch is not found', async () => {
      const branchSlug = 'mock-branch-slug';
      (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(service.findAll(branchSlug)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should get success and return a array of tables', async () => {
      const branchSlug = 'mock-branch-slug';
      const branch = {
        name: 'Mock branch name',
        address: 'Mock branch address',
        id: 'mock-branch-id',
        slug: 'mock-branch-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Branch;
      const table = {
        name: 'Mock table name',
        branch: new Branch(),
        id: 'mock-table-id',
        slug: 'mock-table-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Table;
      const mockOutput = [table];

      (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(branch);
      (tableRepositoryMock.find as jest.Mock).mockResolvedValue(mockOutput);
      (mapperMock.mapArray as jest.Mock).mockReturnValue(mockOutput);

      const result = await service.findAll(branchSlug);
      expect(result).toEqual(mockOutput);
      expect(mapperMock.mapArray).toHaveBeenCalledTimes(1);
    });
  });

  describe('Change table status', () => {
    it('should throw error when table is not found', async () => {
      const slug = 'mock-table-slug';
      (tableRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(
        service.changeStatus(slug, { status: 'active' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should change status success and return changed table data', async () => {
      const slug = 'mock-table-slug';
      const table = {
        name: 'Mock table name',
        branch: new Branch(),
        id: 'mock-table-id',
        slug: 'mock-table-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Table;
      const mockOutput = {
        name: 'Mock table name',
        branch: new Branch(),
        id: 'mock-table-id',
        slug: 'mock-table-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Table;

      (tableRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(table);
      (tableRepositoryMock.save as jest.Mock).mockResolvedValue(mockOutput);
      (mapperMock.map as jest.Mock).mockReturnValue(mockOutput);

      const result = await service.changeStatus(slug, { status: 'active' });
      expect(result).toEqual(mockOutput);
      expect(mapperMock.map).toHaveBeenCalledTimes(1);
    });
  });

  describe('Update table', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should throw error when table is not found', async () => {
      const slug = 'mock-table-slug';
      const mockInput = {
        name: 'Mock table name',
        location: 'mock-table-location',
      } as UpdateTableRequestDto;
      (tableRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.update(slug, mockInput)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw error when updated name already exist in this branch', async () => {
      const slug = 'mock-table-slug';
      const mockInput = {
        name: 'Mock table name',
        location: 'mock-table-location',
      } as UpdateTableRequestDto;
      const table = {
        name: 'Mock table name',
        branch: new Branch(),
        id: 'mock-table-id',
        slug: 'mock-table-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Table;

      (tableRepositoryMock.findOne as jest.Mock).mockResolvedValue(table);
      (mapperMock.map as jest.Mock).mockImplementationOnce(() => table);
      // jest.spyOn(service, 'isExistUpdatedName').mockResolvedValue(true);

      await expect(service.update(slug, mockInput)).rejects.toThrow(
        BadRequestException,
      );
    });

    // it('should update success and return updated table', async () => {
    //   const slug = 'mock-table-slug';
    //   const mockInput = {
    //     name: 'Mock table name',
    //     location: 'mock-table-location',
    //   } as UpdateTableRequestDto;
    //   const mockOutput = {
    //     name: 'Mock table name',
    //     branch: new Branch(),
    //     id: 'mock-table-id',
    //     slug: 'mock-table-slug',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   } as Table;

    //   (tableRepositoryMock.findOne as jest.Mock).mockResolvedValue(mockOutput);
    //   (mapperMock.map as jest.Mock).mockImplementationOnce(() => mockOutput);
    //   // jest.spyOn(service, 'isExistUpdatedName').mockResolvedValue(false);
    //   (tableRepositoryMock.save as jest.Mock).mockResolvedValue(mockOutput);
    //   (mapperMock.map as jest.Mock).mockReturnValue(mockOutput);

    //   const result = await service.update(slug, mockInput);
    //   expect(result).toEqual(mockOutput);
    //   expect(mapperMock.map).toHaveBeenCalledTimes(2);
    // });
  });

  describe('Delete table', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error when table is not found', async () => {
      const slug = 'mock-table-slug';
      (tableRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(slug)).rejects.toThrow(BadRequestException);
    });

    it('should delete success and return deleted records', async () => {
      const slug = 'mock-table-slug';
      const table = {
        name: 'Mock table name',
        branch: new Branch(),
        id: 'mock-table-id',
        slug: 'mock-table-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Table;
      const mockOutput = { affected: 1 };
      (tableRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(table);
      (tableRepositoryMock.softDelete as jest.Mock).mockResolvedValue(
        mockOutput,
      );

      const result = await service.remove(slug);
      expect(result).toEqual(mockOutput.affected);
    });
  });
});
