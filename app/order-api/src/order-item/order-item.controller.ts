import { Controller } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { OrderItemService } from "./order-item.service";

@ApiTags('Order Item')
@Controller('order-items')
@ApiBearerAuth()
export class OrderItemController {
  constructor(private orderItemService: OrderItemService){}
}