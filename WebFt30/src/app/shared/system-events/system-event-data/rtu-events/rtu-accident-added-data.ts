export interface RtuAccidentAddedData {
  EventId: number;
  RegisteredAt: Date;
  At: string;
  EventType: string;
  Obj: string;
  ObjId: string;
  IsGoodAccident: boolean;
}

export interface NetworkEventAddedData {
  EventId: number;
  RegisteredAt: Date;
  At: string;
  EventType: string;
  Obj: string;
  ObjId: string;
  IsRtuAvailable: boolean;
}

export interface BopNetworkEventAddedData {
  EventId: number;
  RegisteredAt: Date;
  At: string;
  EventType: string;
  Obj: string;
  ObjId: string;
  IsOk: boolean;
}

export interface MeasurementAddedData {
  EventId: number;
  RegisteredAt: Date;
  At: string;
  EventType: string;
  Obj: string;
  ObjId: string;
  IsOk: boolean;
}
