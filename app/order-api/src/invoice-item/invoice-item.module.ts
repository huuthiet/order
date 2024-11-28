import { Module } from '@nestjs/common';
import { InvoiceItemService } from './invoice-item.service';
import { InvoiceItemController } from './invoice-item.controller';
import { InvoiceItemProfile } from './invoice-item.mapper';

@Module({
  controllers: [InvoiceItemController],
  providers: [InvoiceItemService, InvoiceItemProfile],
})
export class InvoiceItemModule {}
