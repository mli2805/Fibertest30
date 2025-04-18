import { BaseRefType, FiberState } from 'src/app/core/store/models/ft30/ft-enums';

export interface AnyTypeAccidentAddedData {
  EventType: string;
  EventId: number;
  RegisteredAt: Date;
  At: string;
  ObjTitle: string;
  ObjId: string;
  RtuId: string;
  IsOk: boolean;
}

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
