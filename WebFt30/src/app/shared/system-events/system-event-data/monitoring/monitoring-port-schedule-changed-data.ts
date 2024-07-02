import { MonitoringSchedulerMode } from 'src/grpc-generated';
import { Duration } from 'src/grpc-generated/google/protobuf/duration';

export interface MonitoringPortScheduleChangedData {
  MonitoringPortId: number;
  Mode: MonitoringSchedulerMode;
  Interval: number | null;
  TimeSlotIds: number[];
}
