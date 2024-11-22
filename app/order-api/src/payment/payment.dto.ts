import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @AutoMap()
  @ApiProperty()
  @ApiProperty({
    example: 'bank-transfer',
    description: 'Payment method',
    enum: ['cash', 'bank-transfer', 'internal'],
  })
  paymentMethod: string;

  @AutoMap()
  @ApiProperty()
  orderSlug: string;
}
