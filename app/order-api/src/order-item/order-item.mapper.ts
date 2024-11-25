import { createMap, extend, forMember, Mapper, mapWith } from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { OrderItem } from "./order-item.entity";
import { CreateOrderItemRequestDto, OrderItemResponseDto, UpdateOrderItemRequestDto } from "./order-item.dto";
import { baseMapper } from "src/app/base.mapper";
import { VariantResponseDto } from "src/variant/variant.dto";
import { Variant } from "src/variant/variant.entity";
import { TrackingOrderItemResponseDto } from "src/tracking-order-item/tracking-order-item.dto";
import { TrackingOrderItem } from "src/tracking-order-item/tracking-order-item.entity";

@Injectable()
export class OrderItemProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        OrderItem,
        OrderItemResponseDto,
        forMember(
          (destination) => destination.variant,
          mapWith(VariantResponseDto, Variant, (source) => source.variant)
        ),
        forMember(
          (destination) => destination.trackingOrderItems,
          mapWith(
            TrackingOrderItemResponseDto, 
            TrackingOrderItem, 
            (source) => source.trackingOrderItems)
        ),
        extend(baseMapper(mapper)),
      );

      createMap(
        mapper,
        CreateOrderItemRequestDto,
        OrderItem
      );

      createMap(
        mapper,
        UpdateOrderItemRequestDto,
        OrderItem
      );
    }
  }
}  