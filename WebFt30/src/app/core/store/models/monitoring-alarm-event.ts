import { MonitoringAlarmType } from './monitoring-alarm-type';
import { MonitoringChange } from './monitoring-result';

export enum MonitoringAlarmLevel {
  Minor,
  Major,
  Critical
}

export enum MonitoringAlarmStatus {
  Active,
  Resolved
}

export class MonitoringAlarmEvent {
  id!: number;
  monitoringAlarmGroupId!: number;
  monitoringPortId!: number;
  monitoringAlarmId!: number;
  monitoringResultId!: number;
  type!: MonitoringAlarmType;
  distanceMeters!: number | null;
  at!: Date;

  oldLevel!: MonitoringAlarmLevel | null;
  level!: MonitoringAlarmLevel;

  oldStatus!: MonitoringAlarmStatus | null;
  status!: MonitoringAlarmStatus;

  change!: MonitoringChange | null;
}
