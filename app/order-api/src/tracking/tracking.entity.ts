import { AutoMap } from "@automapper/classes";
import { Base } from "src/app/base.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { WorkFlowStatus } from './tracking.constants';
import { TrackingOrderItem } from "src/tracking-order-item/tracking-order-item.entity";

@Entity('tracking_tbl')
export class Tracking extends Base {
  @AutoMap()
  @Column({ name: 'work_flow_instance_column', nullable: true })
  workFlowInstance: string;

  @AutoMap()
  @Column({ name: 'status_column', default: WorkFlowStatus.PENDING })
  status: string;

  // one to many with tracking order item
  @OneToMany(() => TrackingOrderItem, 
    (trackingOrderItem) => trackingOrderItem.tracking)
  trackingOrderItems: TrackingOrderItem[];
}