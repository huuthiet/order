import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './invoice.entity';
import { Order } from 'src/order/order.entity';
import { InvoiceProfile } from './invoice.mapper';
import { PdfModule } from 'src/pdf/pdf.module';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Order]), PdfModule],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceProfile],
})
export class InvoiceModule {}
