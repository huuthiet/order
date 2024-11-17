import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import * as shortid from 'shortid';

@EventSubscriber()
export class AppSubscriber implements EntitySubscriberInterface {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }
  /**
   * Called before entity insertion.
   */
  beforeInsert(event: InsertEvent<{ slug: string }>) {
    // if (_.has(event.entity, 'slug'))
    event.entity.slug = shortid.generate();
  }
}
