import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { Table } from './table.entity';
import { RobotConnectorClient } from 'src/robot-connector/robot-connector.client';
import {
  UpdateQRLocationMetadataRequestDto,
  UpdateQRLocationRequestDto,
} from 'src/robot-connector/robot-connector.dto';

@EventSubscriber()
export class TableSubscriber implements EntitySubscriberInterface<Table> {
  constructor(
    dataSource: DataSource,
    private readonly robotConnectorClient: RobotConnectorClient,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Table;
  }

  async afterInsert(event: InsertEvent<Table>) {
    // Update location status after created a new table
    const table = event.entity;
    const location = await this.robotConnectorClient.getQRLocationById(
      table.location,
    );
    if (location) {
      const requestData = {
        ...location,
        metadata: {
          ...location.metadata,
          isAssigned: true,
        },
      } as UpdateQRLocationRequestDto;
      await this.robotConnectorClient.updateQRLocation(
        location.id,
        requestData,
      );
    }
  }
}
