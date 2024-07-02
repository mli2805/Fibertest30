import { MonitoringPortStatus } from 'src/grpc-generated';
import { MonitoringSchedule } from './monitoring-schedule';
import { MonitoringBaseline } from './monitoring-baseline';

export class MonitoringPort {
  id!: number;
  note!: string;
  otauPortId!: number;
  otauId!: number;

  status!: MonitoringPortStatus;
  schedule!: MonitoringSchedule;
  baseline: MonitoringBaseline | null = null;

  alarmProfileId!: number;
}
