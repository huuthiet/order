import { MockType, repositoryMockFactory } from "src/test-utils/repository-mock.factory";
import { TrackingService } from "./tracking.service";
import { DataSource, Repository } from "typeorm";
import { Tracking } from "./tracking.entity";
import { TrackingOrderItem } from "src/tracking-order-item/tracking-order-item.entity";
import { Order } from "src/order/order.entity";
import { OrderItem } from "src/order-item/order-item.entity";
import { Table } from "src/table/table.entity";
import { Workflow } from "src/workflow/workflow.entity";
import { Mapper } from "@automapper/core";
import { RobotConnectorClient } from "src/robot-connector/robot-connector.client";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { MAPPER_MODULE_PROVIDER } from "src/app/app.constants";
import { mapperMockFactory } from "src/test-utils/mapper-mock.factory";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { SchedulerRegistry } from "@nestjs/schedule";

describe('TrackingService', () => {
  let service: TrackingService;
  let trackingRepositoryMock: MockType<Repository<Tracking>>;
  let trackingOrderItemRepositoryMock: MockType<Repository<TrackingOrderItem>>;
  let orderRepositoryMock: MockType<Repository<Order>>;
  let orderItemRepositoryMock: MockType<Repository<OrderItem>>;
  let tableRepositoryMock: MockType<Repository<Table>>;
  let workflowRepositoryMock: MockType<Repository<Workflow>>;
  let mapperMock: MockType<Mapper>;
  let schedulerRegistry: SchedulerRegistry;

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
        TrackingService,
        RobotConnectorClient,
        SchedulerRegistry,
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
          provide: getRepositoryToken(Tracking),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(TrackingOrderItem),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Order),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Table),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Workflow),
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

    service = module.get<TrackingService>(TrackingService);
    orderRepositoryMock = module.get(getRepositoryToken(Order));
    trackingRepositoryMock = module.get(getRepositoryToken(Tracking));
    trackingOrderItemRepositoryMock = module.get(getRepositoryToken(TrackingOrderItem));
    orderItemRepositoryMock = module.get(getRepositoryToken(OrderItem));
    tableRepositoryMock = module.get(getRepositoryToken(Table));
    workflowRepositoryMock = module.get(getRepositoryToken(Workflow));
    mapperMock = module.get(MAPPER_MODULE_PROVIDER);
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});