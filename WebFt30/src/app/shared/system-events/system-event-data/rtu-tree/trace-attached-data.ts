export interface TraceAttachedData {
  TraceId: string;
  TraceTitle: string;
  PortPath: string;
  RtuId: string;
  RtuTitle: string;
}

export interface TraceDetachedData {
  TraceId: string;
  Title: string;
  RtuId: string;
}

export interface OtauAttachedData {
  OtauAddress: string;
  Serial: string;
  MainCharonPort: number;
  RtuId: string;
  RtuTitle: string;
}

export interface OtauDetachedData {
  OtauAddress: string;
  RtuId: string;
}

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

export interface RtuAddedData {
  RtuId: string;
}
