import { BadRequestException, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderItem } from "./order-item.entity";
import { Repository } from "typeorm";
import { Order } from "src/order/order.entity";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { InjectMapper } from "@automapper/nestjs";
import { Mapper } from "@automapper/core";
import { OrderItemResponseDto, UpdateOrderItemRequestDto } from "./order-item.dto";
import { Variant } from "src/variant/variant.entity";

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Variant)
    private readonly variantRepository: Repository<Variant>,
    @InjectMapper() private readonly mapper: Mapper,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ){}

  // async updateOrderItem (
  //   slug: string,
  //   requestData: UpdateOrderItemRequestDto
  // ): Promise<OrderItemResponseDto> {
  //   const context = `${OrderItemService.name}.${this.updateOrderItem.name}`;
  //   const orderItem = await this.orderItemRepository.findOne({
  //     where: { slug },
  //     relations: ['variant']
  //   });

  //   if(!orderItem) {
  //     this.logger.warn(`Order item ${slug} not found`, context);
  //     throw new BadRequestException('Order item is not found');
  //   }

  //   const order = await this.orderRepository.findOne({
  //     where: {
  //       orderItems: { slug }
  //     }
  //   });
  //   if(!order) {
  //     this.logger.warn(`The order of updated order item ${slug} not found`, context);
  //     throw new BadRequestException('The order of updated order item is not found');
  //   }

  //   const variant = await this.variantRepository.findOne({
  //     where: { slug: requestData.variant },
  //   });
  //   if(!variant) {
  //     this.logger.warn(`The variant of updated order item ${slug} not found`, context);
  //     throw new BadRequestException('The variant of updated order item is not found');
  //   }
  //   const orderItemData = this.mapper.map(requestData, UpdateOrderItemRequestDto, OrderItem);

  //   return;
  // }
}