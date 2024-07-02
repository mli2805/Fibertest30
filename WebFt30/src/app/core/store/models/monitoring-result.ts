import { MeasurementSettings } from './measurement-settings';
import { MonitoringAlarmLevel } from './monitoring-alarm-event';
import { MonitoringAlarmType } from './monitoring-alarm-type';

export enum ValueExactness {
  Exact,
  AtLeast,
  AtMost
}

export class QualifiedValue {
  value!: number;
  exactness!: ValueExactness;
}

export class MonitoringChangeKeyEvent {
  keyEventIndex!: number;
  distanceMeters!: number;
  eventLoss!: number | null;
  eventReflectance!: QualifiedValue | null;
  sectionAttenuation!: number | null;
  isClipped!: boolean | null;
  isReflective!: boolean | null;
  comment!: string;
}

export class MonitoringChange {
  type!: MonitoringAlarmType;
  level!: MonitoringAlarmLevel;
  distanceMeters!: number | null;
  distanceThresholdMeters!: number | null;
  threshold!: number | null;
  thresholdExcessDelta!: number | null;
  reflectanceExcessDeltaExactness!: ValueExactness | null;
  current!: MonitoringChangeKeyEvent | null;
  baseline!: MonitoringChangeKeyEvent | null;
  baselineLeft!: MonitoringChangeKeyEvent | null;
  baselineRight!: MonitoringChangeKeyEvent | null;
}

export class MonitoringResult {
  id!: number;
  completedAt!: Date;
  monitoringPortId!: number;
  baselineId!: number;
  mostSevereChangeLevel!: MonitoringAlarmLevel | null;
  changesCount!: number;
  measurementSettings!: MeasurementSettings | null; // server sends measurementSettings only for specific requests
  changes!: MonitoringChange[] | null; // server changes measurementSettings only for specific requests
}
