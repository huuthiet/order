import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { OrderType } from './order.contants';
import { BaseResponseDto } from 'src/app/base.dto';
import { BranchResponseDto } from 'src/branch/branch.dto';
import {
  CreateOrderItemRequestDto,
  OrderItemResponseDto,
} from 'src/order-item/order-item.dto';
import { Type } from 'class-transformer';
import { Order } from './order.entity';
import { Table } from 'typeorm';
import { OrderItem } from 'src/order-item/order-item.entity';

export class CreateOrderRequestDto {
  @AutoMap()
  @ApiProperty({ description: 'The type of order', example: 'take-out' })
  @IsNotEmpty({ message: 'Invalid type of order' })
  @IsEnum(OrderType, { message: 'Invalid type of order' })
  type: string;

  @AutoMap()
  @ApiProperty({ description: 'The slug of table', example: 'table-' })
  @IsNotEmpty({ message: 'Invalid slug of table' })
  table: string;

  @AutoMap()
  @ApiProperty({
    description: 'The slug of branch',
    example: '',
  })
  @IsNotEmpty({ message: 'Invalid slug of branch' })
  branch: string;

  @AutoMap()
  @ApiProperty({
    description: 'The slug of user that creating order',
    example: '',
  })
  @IsNotEmpty({ message: 'Invalid slug of user that creating order' })
  owner: string;

  @ApiProperty({
    description: 'The array of order items',
    example: [
      {
        quantity: 2,
        variant: 'variant-',
        note: 'Ghi chú',
      },
    ],
  })
  @IsArray({ message: 'Invalid order item list' })
  @ArrayNotEmpty({ message: 'Invalid order item list' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemRequestDto)
  orderItems: CreateOrderItemRequestDto[];
}

export class OwnerResponseDto extends BaseResponseDto {
  @AutoMap()
  phonenumber: string;

  @AutoMap()
  firstName: string;

  @AutoMap()
  lastName: string;
}

export class ApprovalUserResponseDto extends BaseResponseDto {
  @AutoMap()
  phonenumber: string;

  @AutoMap()
  firstName: string;

  @AutoMap()
  lastName: string;

  @AutoMap(() => BranchResponseDto)
  branch: BranchResponseDto;
}

export class OrderPaymentResponseDto extends BaseResponseDto {
  @AutoMap()
  @ApiProperty()
  paymentMethod: string;

  @AutoMap()
  @ApiProperty()
  message: string;

  @AutoMap()
  @ApiProperty()
  transactionId: string;

  @AutoMap()
  statusCode: string;

  @AutoMap()
  statusMessage: string;
}

export class OrderResponseDto extends BaseResponseDto {
  @AutoMap()
  subtotal: number;

  @AutoMap()
  status: string;

  @AutoMap()
  type: string;

  @AutoMap()
  tableName: string;

  @AutoMap(() => OwnerResponseDto)
  owner: OwnerResponseDto;

  @AutoMap(() => ApprovalUserResponseDto)
  approvalBy: ApprovalUserResponseDto;

  @AutoMap(() => [OrderItemResponseDto])
  orderItems: OrderItemResponseDto[];

  @AutoMap(() => OrderPaymentResponseDto)
  payment: OrderPaymentResponseDto;
}

export class GetOrderRequestDto {
  @AutoMap()
  @ApiProperty({
    description: 'The slug of branch',
    example: '',
    required: false,
  })
  @IsOptional()
  branch?: string;

  @AutoMap()
  @ApiProperty({
    description: 'The slug of owner',
    example: '',
    required: false,
  })
  @IsOptional()
  owner?: string;
}

export class CheckDataCreateOrderResponseDto {
  isValid: Boolean;
  message?: string;
  mappedOrder?: Order;
}

export class CheckDataCreateOrderItemResponseDto {
  isValid: Boolean;
  mappedOrderItems?: OrderItem[];
  subtotal?: number;
}
