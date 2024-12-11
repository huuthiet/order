import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Invoice } from './invoice.entity';

@EventSubscriber()
export class InvoiceSubscriber implements EntitySubscriberInterface<Invoice> {
  listenTo(): Function | string {
    return Invoice;
  }

  //   Insert invoice item
  afterInsert(event: InsertEvent<Invoice>): Promise<any> | void {
    const { entity, manager } = event;
  }
}
