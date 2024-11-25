import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Min } from "class-validator";
import { BaseResponseDto } from "src/app/base.dto";
import { ProductResponseDto } from "src/product/product.dto";
import { TrackingOrderItemResponseDto } from "src/tracking-order-item/tracking-order-item.dto";
import { VariantResponseDto } from "src/variant/variant.dto";
import { WorkFlowStatus } from 'src/tracking/tracking.constants';

export class CreateOrderItemRequestDto {
  @AutoMap()
  @ApiProperty({ description: 'The quantity of order item', example: 2 })
  @IsNotEmpty({ message: 'Invalid quantity of order item' })
  @Min(1, { message: 'Invalid quantity of order item' })
  quantity: number;

  @AutoMap()
  @ApiProperty({ description: 'The note of order item', example: 'Ghi chú' })
  @IsNotEmpty({ message: 'Invalid note of order item' })
  note: string;

  @AutoMap()
  @ApiProperty({
    description: 'The slug of variant',
    example: 'variant-slug-123',
  })
  @IsNotEmpty({ message: 'Invalid slug of variant' })
  variant: string;
}

export class UpdateOrderItemRequestDto {
  @AutoMap()
  @ApiProperty({ description: 'The quantity of order item', example: 2 })
  @IsNotEmpty({ message: 'Invalid quantity of order item' })
  @Min(1, { message: 'Invalid quantity of order item' })
  quantity: number;

  @AutoMap()
  @ApiProperty({ description: 'The note of order item', example: 'Ghi chú' })
  @IsNotEmpty({ message: 'Invalid note of order item' })
  note: string;

  @AutoMap()
  @ApiProperty({
    description: 'The slug of variant',
    example: 'variant-slug-123',
  })
  @IsNotEmpty({ message: 'Invalid slug of variant' })
  variant: string;
}

export class StatusOrderItemResponseDto {
  @AutoMap()
  [WorkFlowStatus.PENDING]: number;

  @AutoMap()
  [WorkFlowStatus.RUNNING]: number;

  @AutoMap()
  [WorkFlowStatus.COMPLETED]: number;

  @AutoMap()
  [WorkFlowStatus.FAILED]: number;
}

export class OrderItemResponseDto extends BaseResponseDto {
  @AutoMap()
  quantity: number;

  @AutoMap()
  subtotal: number;

  @AutoMap()
  note: string;

  @AutoMap(() => VariantResponseDto)
  variant: VariantResponseDto;

  @AutoMap(() => [TrackingOrderItemResponseDto])
  trackingOrderItems: TrackingOrderItemResponseDto[];

  @AutoMap(() => StatusOrderItemResponseDto)
  status: StatusOrderItemResponseDto;
}

