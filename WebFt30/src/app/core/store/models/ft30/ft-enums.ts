export enum RtuMaker {
  Iit = 0,
  Veex = 1
}

export enum FiberState {
  //
  NotInTrace = 0x0,
  NotJoined = 0x1,
  //
  Unknown = 0x2,
  NotInZone = 0x3,
  //
  Ok = 0x4,
  Suspicion = 0x5,
  Minor = 0x6,
  Major = 0x7,
  Critical = 0x8,
  User = 0x9,
  FiberBreak = 0xa,
  NoFiber = 0xb,
  //
  HighLighted = 0xe,
  DistanceMeasurement = 0xf,
  //
  Nothing = -1
}

export enum RtuPartState {
  Broken = -1,
  NotSetYet = 0,
  Ok = 1
}

export enum ChannelEvent {
  Broken = -1,
  Nothing = 0,
  Repaired = 1
}

export enum MonitoringState {
  Unknown = 0,
  Off = 1,
  On = 2
}

export enum TceLinkState {
  NoLink = 0,
  SnmpTrapOff = 1,
  SnmpTrapOn = 2
}

export enum BaseRefType {
  None = 0,
  Precise = 1,
  Fast = 2,
  Additional = 3
}

export enum EventStatus {
  JustMeasurementNotAnEvent = -99, // only for trace statistics
  EventButNotAnAccident = -9, // Ok or Suspicion (made by Fast)

  NotImportant = -3,
  Planned = -2,
  NotConfirmed = -1,
  Unprocessed = 0,
  Suspended = 1,
  Confirmed = 2
}

export enum PortMonitoringMode {
  NoTraceJoined = -9,
  TraceHasNoBase = -1,
  Off = 0,
  On = 1
}

export enum Frequency {
  Permanently = 0,
  EveryHour = 1,
  Every6Hours = 6,
  Every12Hours = 12,
  EveryDay = 24,
  Every2Days = 48,
  Every7Days = 168,
  Every30Days = 720,
  DoNot = 9999
}
