import { BaseRefType, FiberState } from 'src/app/core/store/models/ft30/ft-enums';

export interface TraceStateChangedData {
  EventId: number;
  RegisteredAt: Date;
  At: string;
  TraceTitle: string;
  TraceId: string;
  RtuId: string;
  BaseRefType: BaseRefType;
  TraceState: FiberState;
}

export interface NetworkEventAddedData {
  EventId: number;
  RegisteredAt: Date;
  At: string;
  RtuTitle: string;
  RtuId: string;
  IsOk: boolean;
}

export interface BopNetworkEventAddedData {
  EventId: number;
  RegisteredAt: Date;
  At: string;
  BopIp: string;
  BopId: string;
  RtuId: string;
  IsOk: boolean;
}

export interface RtuStateAccidentAddedData {
  EventId: number;
  RegisteredAt: Date;
  At: string;
  ObjTitle: string;
  ObjId: string;
  RtuId: string;
  IsOk: boolean;
}
