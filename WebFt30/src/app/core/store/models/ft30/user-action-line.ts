export enum LogOperationCode {
  ClientStarted = 101,
  ClientExited = 102,
  ClientConnectionLost = 103,
  UsersMachineKeyAssigned,

  RtuAdded = 201,
  RtuUpdated,
  RtuInitialized,
  RtuRemoved,
  // RtuAddressCleared,

  TraceAdded = 301,
  TraceUpdated,
  TraceAttached,
  TraceDetached,
  TraceCleaned,
  TraceRemoved,

  TceAdded,
  TceUpdated,
  TceRemoved,

  BaseRefAssigned = 401,
  MonitoringSettingsChanged,
  MonitoringStarted,
  MonitoringStopped,

  MeasurementUpdated,

  EventsAndSorsRemoved,
  SnapshotMade
}

export const ALL_LOG_OPERATION_CODES: LogOperationCode[] = Object.values(LogOperationCode).filter(
  (v) => typeof v === 'number'
) as LogOperationCode[];

export class UserActionLine {
  ordinal!: number;
  username!: string;
  clientIp!: string;
  registeredAt!: Date;
  logOperationCode!: LogOperationCode;
  rtuTitle!: string;
  traceTitle!: string;
  operationParams!: string;
  userFullName!: string;
}
