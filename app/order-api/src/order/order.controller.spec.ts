import { Test, TestingModule } from "@nestjs/testing";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { ApprovalUserResponseDto, CreateOrderRequestDto, GetOrderRequestDto, OrderPaymentResponseDto, OrderResponseDto, OwnerResponseDto } from "./order.dto";
import { OrderException } from "./order.exception";
import { BadRequestException } from "@nestjs/common";
import { InvoiceResponseDto } from "src/invoice/invoice.dto";

describe('SizeController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn(),
            getAllOrders: jest.fn(),
            getOrderBySlug: jest.fn(),
          }
        }
      ]
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create order', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    });

    it('should throw error if service.createOrder throws', async () => {
      const mockInput = {
        type: "",
        table: "",
        branch: "",
        owner: "",
        orderItems: []
      }  as CreateOrderRequestDto;
      (service.createOrder as jest.Mock).mockRejectedValue(
        new BadRequestException()
      );
      await expect(controller.createOrder(mockInput)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should return result when create success', async () => {
      const mockInput = {
        type: "",
        table: "",
        branch: "",
        owner: "",
        orderItems: []
      } as CreateOrderRequestDto;

      const mockOutput = {
        subtotal: 0,
        status: "",
        type: "",
        tableName: "",
        owner: new OwnerResponseDto,
        approvalBy: new ApprovalUserResponseDto,
        orderItems: [],
        payment: new OrderPaymentResponseDto,
        createdAt: "",
        slug: ""
      } as OrderResponseDto;

      (service.createOrder as jest.Mock).mockResolvedValue(mockOutput);
      expect((await controller.createOrder(mockInput)).result).toEqual(mockOutput);
    });
  });

  describe('Get all orders', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return array of order when get success', async () => {
      const mockInput = {
        branch: '',
        owner: '',
        page: 0,
        size: 0,
        status: []
      } as GetOrderRequestDto;
      const order = {
        subtotal: 0,
        status: "",
        type: "",
        tableName: "",
        owner: new OwnerResponseDto,
        approvalBy: new ApprovalUserResponseDto,
        orderItems: [],
        payment: new OrderPaymentResponseDto,
        createdAt: "",
        slug: "",
        invoice: new InvoiceResponseDto
      } as OrderResponseDto;
      const mockOutput = [order];
      (service.getAllOrders as jest.Mock).mockResolvedValue(mockOutput);
      expect((await controller.getAllOrders(mockInput)).result).toEqual(mockOutput);
    });
  });

  describe('Get specific order by slug', () => {
    it('should throw error when service.getOrderBySlug throws', async () => {
      const slug: string = '';

      (service.getOrderBySlug as jest.Mock).mockRejectedValue(
        new BadRequestException()
      );
      await expect(controller.getOrder(slug)).rejects.toThrow(BadRequestException);
    });

    it('should return order data when get success', async () => {
      const slug: string = '';

      const mockOutput = {
        subtotal: 0,
        status: "",
        type: "",
        tableName: "",
        owner: new OwnerResponseDto,
        approvalBy: new ApprovalUserResponseDto,
        orderItems: [],
        payment: new OrderPaymentResponseDto,
        createdAt: "",
        slug: ""
      } as OrderResponseDto;

      (service.getOrderBySlug as jest.Mock).mockResolvedValue(mockOutput);
      expect((await controller.getOrder(slug)).result).toEqual(mockOutput);
    });
  });
});