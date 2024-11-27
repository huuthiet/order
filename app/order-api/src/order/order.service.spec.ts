import { MockType, repositoryMockFactory } from "src/test-utils/repository-mock.factory";
import { OrderService } from "./order.service";
import { Repository } from "typeorm";
import { Order } from "./order.entity";
import { Mapper } from "@automapper/core";
import { Test, TestingModule } from "@nestjs/testing";
import { Table } from "src/table/table.entity";
import { Branch } from "src/branch/branch.entity";
import { User } from "src/user/user.entity";
import { Variant } from "src/variant/variant.entity";
import { MAPPER_MODULE_PROVIDER } from "src/app/app.constants";
import { mapperMockFactory } from "src/test-utils/mapper-mock.factory";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { getRepositoryToken } from "@nestjs/typeorm";
import { OrderType } from "./order.contants";
import { CheckDataCreateOrderResponseDto, CreateOrderRequestDto } from "./order.dto";
import { Tracking } from "src/tracking/tracking.entity";
import { RobotConnectorClient } from "src/robot-connector/robot-connector.client";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { DataSource } from 'typeorm';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepositoryMock: MockType<Repository<Order>>;
  let tableRepositoryMock: MockType<Repository<Table>>;
  let branchRepositoryMock: MockType<Repository<Branch>>;
  let userRepositoryMock: MockType<Repository<User>>;
  let variantRepositoryMock: MockType<Repository<Variant>>;
  let trackingRepositoryMock: MockType<Repository<Tracking>>;
  let mapperMock: MockType<Mapper>;

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        RobotConnectorClient,
        HttpService,
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
          provide: 'AXIOS_INSTANCE_TOKEN',
          useValue: {
            get: jest.fn(),
            post: jest.fn(),
          },
        },
        { 
          provide: DataSource, 
          useValue: mockDataSource 
        },
        {
          provide: getRepositoryToken(Order),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Table),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Variant),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Branch),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Tracking),
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
      ]
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepositoryMock = module.get(getRepositoryToken(Order));
    variantRepositoryMock = module.get(getRepositoryToken(Variant));
    branchRepositoryMock = module.get(getRepositoryToken(Branch));
    tableRepositoryMock = module.get(getRepositoryToken(Table));
    userRepositoryMock = module.get(getRepositoryToken(User));
    trackingRepositoryMock = module.get(getRepositoryToken(Tracking));
    mapperMock = module.get(MAPPER_MODULE_PROVIDER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('Check order type - checkOrderType', () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   it('should return null when type of order is take out', async () => {
  //     const type: OrderType = OrderType.TAKE_OUT;
  //     const tableSlug: string = 'mock-table-slug';
  //     const branchSlug: string = 'mock-branch-slug';
  //     expect(await service.checkOrderType(tableSlug, branchSlug, type)).toEqual(null);
  //   });

  //   it('should return null when type of order is at table but table is not found', async () => {
  //     const type: OrderType = OrderType.AT_TABLE;
  //     const tableSlug: string = 'mock-table-slug';
  //     const branchSlug: string = 'mock-branch-slug';
  //     (tableRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);
  //     expect(await service.checkOrderType(tableSlug, branchSlug, type)).toEqual(null);
  //   });

  //   it('should return null when type of order is at table but table is not found', async () => {
  //     const type: OrderType = OrderType.AT_TABLE;
  //     const tableSlug: string = 'mock-table-slug';
  //     const branchSlug: string = 'mock-branch-slug';
  //     const mockOutput = {
  //       name: "mock-table-name",
  //       isEmpty: true,
  //       branch: new Branch(),
  //       id: "mock-table-id",
  //       slug: "mock-table-slug",
  //       createdAt: new Date(),
  //       updatedAt: new Date()
  //     } as Table;

  //     (tableRepositoryMock.findOne as jest.Mock).mockResolvedValue(mockOutput);
  //     expect(await service.checkOrderType(tableSlug, branchSlug, type)).toEqual(mockOutput);
  //   });
  // });

  // describe('Check created order data - checkCreatedOrderData', () => {
  //   it('should return invalid result when branch is not found', async () => {
  //     const mockInput = {
  //       type: OrderType.AT_TABLE,
  //       table: "mock-table-slug",
  //       branch: "mock-branch-slug",
  //       owner: "mock-user-slug",
  //     } as CreateOrderRequestDto;
  //     const mockOutput = {
  //       isValid: false,
  //       message: 'Branch is not found'
  //     } as CheckDataCreateOrderResponseDto;

  //     (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);
  //     expect(await service.checkCreatedOrderData(mockInput)).toEqual(mockOutput);
  //   });

  //   it('should return invalid result when order at table but table is not found in this branch', async () => {
  //     const mockInput = {
  //       type: OrderType.AT_TABLE,
  //       table: "mock-table-slug",
  //       branch: "mock-branch-slug",
  //       owner: "mock-user-slug",
  //     } as CreateOrderRequestDto;
  //     const mockBranch = {
  //       name: "mock-branch-name",
  //       address: "mock-branch-address",
  //       id: "mock-branch-id",
  //       slug: "mock-branch-slug",
  //       createdAt: new Date(),
  //       updatedAt: new Date()
  //     } as Branch;
  //     const mockOutput = {
  //       isValid: false,
  //       message: 'Table is not found in this branch'
  //     } as CheckDataCreateOrderResponseDto;

  //     (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(mockBranch);
  //     jest.spyOn(service, 'checkOrderType').mockResolvedValue(null);
  //     expect(await service.checkCreatedOrderData(mockInput)).toEqual(mockOutput);
  //   });

  //   it('should return invalid result when order at table but owner is not found', async () => {
  //     const mockInput = {
  //       type: OrderType.AT_TABLE,
  //       table: "mock-table-slug",
  //       branch: "mock-branch-slug",
  //       owner: "mock-user-slug",
  //     } as CreateOrderRequestDto;
  //     const mockBranch = {
  //       name: "mock-branch-name",
  //       address: "mock-branch-address",
  //       id: "mock-branch-id",
  //       slug: "mock-branch-slug",
  //       createdAt: new Date(),
  //       updatedAt: new Date()
  //     } as Branch;
  //     const table = {
  //       name: "mock-table-name",
  //       isEmpty: true,
  //       branch: new Branch(),
  //       id: "mock-table-id",
  //       slug: "mock-table-slug",
  //       createdAt: new Date(),
  //       updatedAt: new Date()
  //     } as Table;
  //     const mockOutput = {
  //       isValid: false,
  //       message: 'The owner is not found'
  //     } as CheckDataCreateOrderResponseDto;

  //     (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(mockBranch);
  //     jest.spyOn(service, 'checkOrderType').mockResolvedValue(table);
  //     (userRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);
  //     expect(await service.checkCreatedOrderData(mockInput)).toEqual(mockOutput);
  //   });

  //   it('should return valid result when order at table', async () => {
  //     const mockInput = {
  //       type: OrderType.AT_TABLE,
  //       table: "mock-table-slug",
  //       branch: "mock-branch-slug",
  //       owner: "mock-user-slug",
  //     } as CreateOrderRequestDto;
  //     const mockBranch = {
  //       name: "mock-branch-name",
  //       address: "mock-branch-address",
  //       id: "mock-branch-id",
  //       slug: "mock-branch-slug",
  //       createdAt: new Date(),
  //       updatedAt: new Date()
  //     } as Branch;
  //     const table = {
  //       name: "mock-table-name",
  //       isEmpty: true,
  //       branch: new Branch(),
  //       id: "mock-table-id",
  //       slug: "mock-table-slug",
  //       createdAt: new Date(),
  //       updatedAt: new Date()
  //     } as Table;
  //     const owner = {
  //       phonenumber: "",
  //       password: "",
  //       firstName: "",
  //       lastName: "",
  //       isActive: false,
  //       branch: new Branch,
  //       id: "mock-user-id",
  //       slug: "mock-user-slug",
  //       createdAt: new Date(),
  //       updatedAt: new Date()
  //     } as User;
  //     const order = {
  //       subtotal: 0,
  //       status: "mock-order-status",
  //       type: "mock-order-type",
  //       branch: new Branch(),
  //       owner: new User(),
  //       id: "mock-order-id",
  //       slug: "mock-order-slug",
  //       createdAt: new Date(),
  //       updatedAt: new Date()
  //     } as Order;
  //     const mockOutput = {
  //       isValid: true,
  //       mappedOrder: order
  //     } as CheckDataCreateOrderResponseDto;
      
  //     (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(mockBranch);
  //     jest.spyOn(service, 'checkOrderType').mockResolvedValue(table);
  //     (userRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(owner);
  //     (mapperMock.map as jest.Mock).mockReturnValue(order)
  //     expect(await service.checkCreatedOrderData(mockInput)).toEqual(mockOutput);
  //   });
  // });
});