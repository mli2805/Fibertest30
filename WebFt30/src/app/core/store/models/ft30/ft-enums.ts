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
