import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsEnum, IsNotEmpty, ValidateNested } from "class-validator";
import { BaseResponseDto } from "src/app/base.dto";
import { CreateTrackingOrderItemRequestDto, TrackingOrderItemResponseDto } from "src/tracking-order-item/tracking-order-item.dto";
import { TrackingType } from "./tracking.constants";

export class CreateTrackingRequestDto {
  @AutoMap()
  @ApiProperty({ description: 'The type of tracking', example: 'by-robot' })
  @IsNotEmpty({ message: 'Invalid type of tracking' })
  @IsEnum(TrackingType, { message: 'Invalid type of tracking' })
  type: string;
  
  @ApiProperty({ 
    description: 'The array of tracking order item', 
    example: [
      {
        quantity: 2,
        orderItem: 'order-item-slug-123',
      }
    ] 
  })
  @IsArray({ message: 'Invalid tracking order item list' })
  @ArrayNotEmpty({ message: 'Invalid tracking order item list' })
  @ValidateNested({ each: true })
  @Type(() => CreateTrackingOrderItemRequestDto)
  trackingOrderItems: CreateTrackingOrderItemRequestDto[];
}

export class TrackingResponseDto extends BaseResponseDto {
  @AutoMap()
  status: string;

  @AutoMap(() => [TrackingOrderItemResponseDto])
  trackingOrderItems: TrackingOrderItemResponseDto[];
}