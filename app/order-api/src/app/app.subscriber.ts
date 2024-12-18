import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { getRandomString } from 'src/helper';

@EventSubscriber()
export class AppSubscriber implements EntitySubscriberInterface {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }
  /**
   * Called before entity insertion.
   */
  beforeInsert(event: InsertEvent<{ slug: string }>) {
    if (event.entity.slug) return;
    const randomString = getRandomString();
    event.entity.slug = randomString;
  }
}
