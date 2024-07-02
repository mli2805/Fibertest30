import { MonitoringSchedulerMode } from 'src/grpc-generated';

export class MonitoringSchedule {
  schedulerMode!: MonitoringSchedulerMode;
  intervalSeconds!: number | null;
  timeSlotIds!: number[];
}
