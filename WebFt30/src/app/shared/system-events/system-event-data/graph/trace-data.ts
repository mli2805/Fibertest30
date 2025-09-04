import { FiberState } from 'src/app/core/store/models/ft30/ft-enums';

export interface TraceAddedData {
  TraceId: string;
  RtuId: string;
}

export interface TraceCleanedData {
  TraceId: string;
}

export interface TraceRemovedData {
  TraceId: string;
}

export interface TraceAttachedData {
  TraceId: string;
  TraceTitle: string;
  TraceState: FiberState;
  PortPath: string;
  RtuId: string;
  RtuTitle: string;
}

export interface TraceDetachedData {
  TraceId: string;
  Title: string;
  RtuId: string;
}

export interface AllTracesDetachedData {
  RtuId: string;
}
