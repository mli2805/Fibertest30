import {
  MonitoringAlarmEvent,
  MonitoringAlarmLevel,
  MonitoringAlarmStatus
} from './monitoring-alarm-event';
import { MonitoringAlarmType } from './monitoring-alarm-type';

export class MonitoringAlarm {
  id!: number;
  alarmGroupId!: number;
  monitoringPortId!: number;
  monitoringResultId!: number;
  lastChangedAt!: Date;
  activeAt!: Date;
  resolvedAt!: Date | null;
  type!: MonitoringAlarmType;
  level!: MonitoringAlarmLevel;
  status!: MonitoringAlarmStatus;
  distanceMeters!: number | null;

  events!: MonitoringAlarmEvent[];
}
