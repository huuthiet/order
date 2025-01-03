import {
  MockType,
  repositoryMockFactory,
} from 'src/test-utils/repository-mock.factory';
import { OrderService } from './order.service';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { Mapper } from '@automapper/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Table } from 'src/table/table.entity';
import { Branch } from 'src/branch/branch.entity';
import { User } from 'src/user/user.entity';
import { Variant } from 'src/variant/variant.entity';
import { MAPPER_MODULE_PROVIDER } from 'src/app/app.constants';
import { mapperMockFactory } from 'src/test-utils/mapper-mock.factory';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OrderType } from './order.contants';
import {
  CreateOrderRequestDto,
  GetOrderRequestDto,
  OrderResponseDto,
  OwnerResponseDto,
} from './order.dto';
import { Tracking } from 'src/tracking/tracking.entity';
import { RobotConnectorClient } from 'src/robot-connector/robot-connector.client';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { BranchException } from 'src/branch/branch.exception';
import { TableException } from 'src/table/table.exception';
import { OrderException } from './order.exception';
import { CreateOrderItemRequestDto } from 'src/order-item/order-item.dto';
import { OrderItem } from 'src/order-item/order-item.entity';
import { Size } from 'src/size/size.entity';
import { Product } from 'src/product/product.entity';
import { VariantException } from 'src/variant/variant.exception';
import { BranchValidation } from 'src/branch/branch.validation';
import { VariantValidation } from 'src/variant/variant.validation';
import { WorkflowStatus } from 'src/workflow/workflow.constants';
import { TrackingOrderItem } from 'src/tracking-order-item/tracking-order-item.entity';
import { MenuItem } from 'src/menu-item/menu-item.entity';
import { Menu } from 'src/menu/menu.entity';
import { MenuException } from 'src/menu/menu.exception';
import { ProductException } from 'src/product/product.exception';
import { SystemConfigService } from 'src/system-config/system-config.service';
import { SystemConfig } from 'src/system-config/system-config.entity';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepositoryMock: MockType<Repository<Order>>;
  let tableRepositoryMock: MockType<Repository<Table>>;
  let branchRepositoryMock: MockType<Repository<Branch>>;
  let userRepositoryMock: MockType<Repository<User>>;
  let variantRepositoryMock: MockType<Repository<Variant>>;
  let trackingRepositoryMock: MockType<Repository<Tracking>>;
  let menuRepositoryMock: MockType<Repository<Menu>>;
  let menuItemRepositoryMock: MockType<Repository<MenuItem>>;
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
        SystemConfigService,
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
          useValue: mockDataSource,
        },
        {
          provide: getRepositoryToken(SystemConfig),
          useFactory: repositoryMockFactory,
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
          provide: getRepositoryToken(Menu),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(MenuItem),
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

    service = module.get<OrderService>(OrderService);
    orderRepositoryMock = module.get(getRepositoryToken(Order));
    variantRepositoryMock = module.get(getRepositoryToken(Variant));
    branchRepositoryMock = module.get(getRepositoryToken(Branch));
    tableRepositoryMock = module.get(getRepositoryToken(Table));
    userRepositoryMock = module.get(getRepositoryToken(User));
    trackingRepositoryMock = module.get(getRepositoryToken(Tracking));
    menuRepositoryMock = module.get(getRepositoryToken(Menu));
    menuItemRepositoryMock = module.get(getRepositoryToken(MenuItem));
    mapperMock = module.get(MAPPER_MODULE_PROVIDER);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructOrder - validate data before create order ', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return invalid result when branch is not found', async () => {
      const mockInput = {
        type: OrderType.AT_TABLE,
        table: 'mock-table-slug',
        branch: 'mock-branch-slug',
        owner: 'mock-user-slug',
      } as CreateOrderRequestDto;

      (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(service.constructOrder(mockInput)).rejects.toThrow(
        BranchException,
      );
    });

    it('should return invalid result when order at table but table is not found in this branch', async () => {
      const mockInput = {
        type: OrderType.AT_TABLE,
        table: 'mock-table-slug',
        branch: 'mock-branch-slug',
        owner: 'mock-user-slug',
      } as CreateOrderRequestDto;
      const mockBranch = {
        name: 'mock-branch-name',
        address: 'mock-branch-address',
        id: 'mock-branch-id',
        slug: 'mock-branch-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Branch;

      (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(
        mockBranch,
      );
      (tableRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);
      await expect(service.constructOrder(mockInput)).rejects.toThrow(
        TableException,
      );
    });

    it('should return invalid result when order at table but owner is not found', async () => {
      const mockInput = {
        type: OrderType.AT_TABLE,
        table: 'mock-table-slug',
        branch: 'mock-branch-slug',
        owner: 'mock-user-slug',
      } as CreateOrderRequestDto;
      const mockBranch = {
        name: 'mock-branch-name',
        address: 'mock-branch-address',
        id: 'mock-branch-id',
        slug: 'mock-branch-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Branch;
      const table = {
        name: 'mock-table-name',
        branch: new Branch(),
        id: 'mock-table-id',
        slug: 'mock-table-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'mock-status',
      } as Table;

      (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(
        mockBranch,
      );
      (tableRepositoryMock.findOne as jest.Mock).mockResolvedValue(table);
      (userRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(null);
      await expect(service.constructOrder(mockInput)).rejects.toThrow(
        OrderException,
      );
    });

    it('should return valid result when order at table', async () => {
      const mockInput = {
        type: OrderType.AT_TABLE,
        table: 'mock-table-slug',
        branch: 'mock-branch-slug',
        owner: 'mock-user-slug',
        orderItems: [],
      } as CreateOrderRequestDto;
      const mockBranch = {
        name: 'mock-branch-name',
        address: 'mock-branch-address',
        id: 'mock-branch-id',
        slug: 'mock-branch-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Branch;
      const table = {
        name: 'mock-table-name1',
        branch: new Branch(),
        id: 'mock-table-id',
        slug: 'mock-table-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'mock-status',
      } as Table;
      const owner = {
        phonenumber: '',
        password: '',
        firstName: '',
        lastName: '',
        isActive: false,
        branch: new Branch(),
        id: 'mock-user-id',
        slug: 'mock-user-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
      const mockOutput = {
        subtotal: 0,
        status: 'mock-order-status',
        type: 'mock-order-type',
        branch: new Branch(),
        owner: new User(),
        id: 'mock-order-id',
        slug: 'mock-order-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Order;

      (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(
        mockBranch,
      );
      (tableRepositoryMock.findOne as jest.Mock).mockResolvedValue(table);
      (userRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(owner);
      (mapperMock.map as jest.Mock).mockReturnValue(mockOutput);
      expect(await service.constructOrder(mockInput)).toEqual(mockOutput);
    });

    it('should return valid result when order take out', async () => {
      const mockInput = {
        type: OrderType.TAKE_OUT,
        table: 'mock-table-slug',
        branch: 'mock-branch-slug',
        owner: 'mock-user-slug',
        orderItems: [],
      } as CreateOrderRequestDto;
      const mockBranch = {
        name: 'mock-branch-name',
        address: 'mock-branch-address',
        id: 'mock-branch-id',
        slug: 'mock-branch-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Branch;
      const owner = {
        phonenumber: '',
        password: '',
        firstName: '',
        lastName: '',
        isActive: false,
        branch: new Branch(),
        id: 'mock-user-id',
        slug: 'mock-user-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;
      const mockOutput = {
        subtotal: 0,
        status: 'mock-order-status',
        type: 'mock-order-type',
        branch: new Branch(),
        owner: new User(),
        id: 'mock-order-id',
        slug: 'mock-order-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Order;

      (branchRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(
        mockBranch,
      );
      (userRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(owner);
      (mapperMock.map as jest.Mock).mockReturnValue(mockOutput);
      expect(await service.constructOrder(mockInput)).toEqual(mockOutput);
    });
  });

  describe('constructOrderItem', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw exception when not found menu today', async () => {
      const createOrderItem: CreateOrderItemRequestDto = {
        quantity: 0,
        note: 'mock-note',
        variant: 'mock-variant-slug',
      };
      const branch: string = 'mock-branch-slug';
      const mockInput = [createOrderItem];
      (menuRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.constructOrderItem(branch, mockInput),
      ).rejects.toThrow(MenuException);
    });

    it('should throw exception when a variant not found', async () => {
      const createOrderItem: CreateOrderItemRequestDto = {
        quantity: 0,
        note: 'mock-note',
        variant: 'mock-variant-slug',
      };
      const branch: string = 'mock-branch-slug';
      const mockInput = [createOrderItem];
      const menu = {
        isTemplate: false,
        date: new Date(),
        menuItems: [],
        id: '',
        slug: '',
      } as Menu;

      (menuRepositoryMock.findOne as jest.Mock).mockResolvedValue(menu);
      (variantRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.constructOrderItem(branch, mockInput),
      ).rejects.toThrow(VariantException);
    });

    it('should throw exception when menu item not found', async () => {
      const createOrderItem: CreateOrderItemRequestDto = {
        quantity: 1,
        note: 'mock-note',
        variant: 'mock-variant-slug',
      };
      const branch: string = 'mock-branch-slug';
      const mockInput = [createOrderItem, createOrderItem];
      const menu = {
        isTemplate: false,
        date: new Date(),
        menuItems: [],
        id: '',
        slug: '',
      } as Menu;
      const variant = {
        price: 100,
        size: new Size(),
        product: {
          id: '',
        },
        id: '',
        slug: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Variant;

      (menuRepositoryMock.findOne as jest.Mock).mockResolvedValue(menu);
      (variantRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(variant);
      (menuItemRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.constructOrderItem(branch, mockInput),
      ).rejects.toThrow(ProductException);
    });

    it('should throw exception when request quantity excess current stock of menu item', async () => {
      const createOrderItem: CreateOrderItemRequestDto = {
        quantity: 6,
        note: 'mock-note',
        variant: 'mock-variant-slug',
      };
      const branch: string = 'mock-branch-slug';
      const mockInput = [createOrderItem];
      const menu = {
        isTemplate: false,
        date: new Date(),
        id: '',
        slug: '',
      } as Menu;
      const variant = {
        price: 100,
        size: new Size(),
        product: {
          id: '',
        },
        id: '',
        slug: '',
      } as Variant;

      const menuItem = {
        defaultStock: 20,
        currentStock: 5, // 6 > 5
        id: '',
        slug: '',
      } as MenuItem;

      (menuRepositoryMock.findOne as jest.Mock).mockResolvedValue(menu);
      (variantRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(variant);
      (menuItemRepositoryMock.findOne as jest.Mock).mockResolvedValue(menuItem);

      await expect(
        service.constructOrderItem(branch, mockInput),
      ).rejects.toThrow(OrderException);
    });

    it('should return valid result', async () => {
      const createOrderItem: CreateOrderItemRequestDto = {
        quantity: 3,
        note: 'mock-note',
        variant: 'mock-variant-slug',
      };
      const branch: string = 'mock-branch-slug';
      const mockInput = [createOrderItem];
      const menu = {
        isTemplate: false,
        date: new Date(),
        id: '',
        slug: '',
      } as Menu;
      const variant = {
        price: 100,
        size: new Size(),
        product: new Product(),
        id: '',
        slug: '',
      } as Variant;

      const menuItem = {
        defaultStock: 20,
        currentStock: 5, // 3 < 5
        id: '',
        slug: '',
      } as MenuItem;

      const orderItem = {
        quantity: 3,
        subtotal: 300,
        order: new Order(),
        variant: new Variant(),
        trackingOrderItems: [],
        id: '',
        slug: '',
      } as OrderItem;
      const mockOutput = [orderItem];

      (menuRepositoryMock.findOne as jest.Mock).mockResolvedValue(menu);
      (variantRepositoryMock.findOneBy as jest.Mock).mockResolvedValue(variant);
      (menuItemRepositoryMock.findOne as jest.Mock).mockResolvedValue(menuItem);
      (mapperMock.map as jest.Mock).mockReturnValue(orderItem);

      expect(await service.constructOrderItem(branch, mockInput)).toEqual(
        mockOutput,
      );
    });
  });

  describe('createOrder - create a new order', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error when service.constructOrder throws', async () => {
      // only mock one of the errors of constructOrder
      const createOrderItem = {
        quantity: 0,
        note: '',
        variant: 'mock-variant-slug',
      } as CreateOrderItemRequestDto;
      const mockInput: CreateOrderRequestDto = {
        type: 'mock-type-order',
        table: 'mock-table-slug',
        branch: 'mock-branch-slug',
        owner: 'mock-owner-slug',
        orderItems: [createOrderItem],
        approvalBy: 'mock-approval-by-slug',
      };

      jest
        .spyOn(service, 'constructOrder')
        .mockRejectedValue(
          new BranchException(BranchValidation.BRANCH_NOT_FOUND),
        );

      await expect(service.createOrder(mockInput)).rejects.toThrow(
        BranchException,
      );
    });

    it('should throw error when service.constructOrderItem throws', async () => {
      const createOrderItem = {
        quantity: 0,
        note: '',
        variant: 'mock-variant-slug',
      } as CreateOrderItemRequestDto;
      const mockInput: CreateOrderRequestDto = {
        type: 'mock-type-order',
        table: 'mock-table-slug',
        branch: 'mock-branch-slug',
        owner: 'mock-owner-slug',
        orderItems: [createOrderItem],
        approvalBy: 'mock-approval-by-slug',
      };
      const order = {
        subtotal: 100,
        status: '',
        type: '',
        branch: new Branch(),
        owner: new User(),
        id: 'mock-order-id',
        slug: 'mock-order-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Order;

      jest.spyOn(service, 'constructOrder').mockResolvedValue(order);
      jest
        .spyOn(service, 'constructOrderItem')
        .mockRejectedValue(
          new VariantException(VariantValidation.VARIANT_NOT_FOUND),
        );

      await expect(service.createOrder(mockInput)).rejects.toThrow(
        OrderException,
      );
    });

    it('should create success and return created order', async () => {
      const createOrderItem = {
        quantity: 0,
        note: '',
        variant: 'mock-variant-slug',
      } as CreateOrderItemRequestDto;
      const mockInput: CreateOrderRequestDto = {
        type: 'mock-type-order',
        table: 'mock-table-slug',
        branch: 'mock-branch-slug',
        owner: 'mock-owner-slug',
        orderItems: [createOrderItem],
        approvalBy: 'mock-approval-by-slug',
      };
      const orderItem = {
        quantity: 1,
        subtotal: 100,
        order: new Order(),
        variant: new Variant(),
        id: 'mock-order-item-id',
        slug: 'mock-order-item-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as OrderItem;
      const menuItem = {
        defaultStock: 0,
        currentStock: 0,
        id: '',
        slug: '',
      } as MenuItem;
      const orderItems = [orderItem];
      const mockOutput = {
        subtotal: 100,
        status: '',
        type: '',
        branch: new Branch(),
        owner: new User(),
        orderItems: [orderItem],
        id: 'mock-order-id',
        slug: 'mock-order-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Order;

      jest.spyOn(service, 'constructOrder').mockResolvedValue(mockOutput);
      jest.spyOn(service, 'constructOrderItem').mockResolvedValue(orderItems);
      (orderRepositoryMock.create as jest.Mock).mockResolvedValue(mockOutput);
      (mockQueryRunner.manager.save as jest.Mock).mockResolvedValue(mockOutput);
      (mapperMock.map as jest.Mock).mockReturnValue(mockOutput);

      expect(await service.createOrder(mockInput)).toEqual(mockOutput);
    });
  });

  describe('getAllOrders - get all order by options(branch, owner', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return all order when retrieve success', async () => {
      const mockInput = {
        page: 0,
        size: 0,
        status: [],
      } as GetOrderRequestDto;
      const order = {
        subtotal: 100,
        status: '',
        type: '',
        branch: new Branch(),
        owner: new User(),
        orderItems: [],
        id: 'mock-order-id',
        slug: 'mock-order-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Order;
      const orders = [order];

      (orderRepositoryMock.findAndCount as jest.Mock).mockResolvedValue([
        orders,
        1,
      ]);
      (mapperMock.mapArray as jest.Mock).mockReturnValue(orders);

      expect((await service.getAllOrders(mockInput)).items).toEqual(orders);
    });
  });

  describe('getOrderBySlug - retrieve a order by slug', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should throw error when order not found', async () => {
      const slug: string = 'mock-order-slug';

      (orderRepositoryMock.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.getOrderBySlug(slug)).rejects.toThrow(
        OrderException,
      );
    });

    it('should retrieved success and throw order data', async () => {
      const slug: string = 'mock-order-slug';

      const mockOutput = {
        subtotal: 0,
        status: '',
        type: '',
        tableName: '',
        owner: new OwnerResponseDto(),
        orderItems: [],
        createdAt: new Date().toString(),
        slug: '',
      } as OrderResponseDto;

      const order = {
        subtotal: 100,
        status: '',
        type: '',
        branch: new Branch(),
        owner: new User(),
        orderItems: [],
        id: 'mock-order-id',
        slug: 'mock-order-slug',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Order;

      (orderRepositoryMock.findOne as jest.Mock).mockResolvedValue(order);
      jest
        .spyOn(service, 'getStatusEachOrderItemInOrder')
        .mockReturnValue(mockOutput);
      // jest.spyOn(service, 'checkAndUpdateStatusOrder').mockResolvedValue('mock-status-order');

      expect(await service.getOrderBySlug(slug)).toEqual(mockOutput);
    });
  });

  describe('getStatusEachOrderItemInOrder', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should calculate status quantities correctly for each order item', () => {
      const tracking = {
        workflowExecution: '',
        status: WorkflowStatus.PENDING,
      } as Tracking;
      const trackingOrderItem = {
        quantity: 5,
        tracking: tracking,
      } as TrackingOrderItem;
      const orderItem = {
        quantity: 10,
        subtotal: 0,
        trackingOrderItems: [trackingOrderItem],
      } as OrderItem;
      const mockInput = {
        subtotal: 0,
        status: '',
        type: '',
        orderItems: [orderItem],
      } as Order;

      const result = service.getStatusEachOrderItemInOrder(mockInput);

      expect(result.orderItems[0].status).toEqual({
        [WorkflowStatus.PENDING]: 5,
        [WorkflowStatus.RUNNING]: 0,
        [WorkflowStatus.COMPLETED]: 0,
        [WorkflowStatus.FAILED]: 0,
        [WorkflowStatus.CANCELED]: 0,
      });
    });
  });
});
