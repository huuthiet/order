import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderType } from './order.contants';
import { BaseResponseDto } from 'src/app/base.dto';
import { BranchResponseDto } from 'src/branch/branch.dto';
import {
  CreateOrderItemRequestDto,
  OrderItemResponseDto,
} from 'src/order-item/order-item.dto';
import { Transform, Type } from 'class-transformer';
import { OrderItem } from 'src/order-item/order-item.entity';
import { InvoiceResponseDto } from 'src/invoice/invoice.dto';
import { MenuItem } from 'src/menu-item/menu-item.entity';
import { TableResponseDto } from 'src/table/table.dto';

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

export class OrderTableResponseDto extends BaseResponseDto {
  @AutoMap()
  @ApiProperty()
  name: string;

  @AutoMap()
  @ApiProperty()
  location: string;

  @AutoMap()
  @ApiProperty()
  status: string;
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

  @AutoMap(() => InvoiceResponseDto)
  invoice: InvoiceResponseDto;

  @AutoMap(() => OrderTableResponseDto)
  table: OrderTableResponseDto;
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
    description: 'The slug of table',
    example: '',
    required: false,
  })
  @IsOptional()
  table?: string;

  @AutoMap()
  @ApiProperty({
    description: 'The slug of owner',
    example: '',
    required: false,
  })
  @IsOptional()
  owner?: string;

  @AutoMap()
  @ApiProperty({
    example: 1,
    description: 'Page number',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @AutoMap()
  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  size: number = 10;

  @AutoMap()
  @ApiProperty({
    description: 'Order status',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : [value],
  )
  status: string[] = [];

  @AutoMap()
  @ApiProperty({
    description: 'Enable paging',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === undefined || value === null) return true; // Default true
    return value === 'true'; // Transform 'true' to `true` and others to `false`
  })
  hasPaging?: boolean;
}
