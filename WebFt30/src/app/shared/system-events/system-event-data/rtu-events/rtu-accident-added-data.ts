export interface RtuAccidentAddedData {
  EventId: number;
  RegisteredAt: Date;
  At: string;
  EventType: string;
  Obj: string;
  IsGoodAccident: boolean;
}

export interface NetworkEventAddedData {
  EventId: number;
  RegisteredAt: Date;
  At: string;
  EventType: string;
  Obj: string;
  IsRtuAvailable: boolean;
}

export interface BopNetworkEventAddedData {
  EventId: number;
  RegisteredAt: Date;
  At: string;
  EventType: string;
  Obj: string;
  IsOk: boolean;
}

export interface MeasurementAddedData {
  EventId: number;
  RegisteredAt: Date;
  At: string;
  EventType: string;
  Obj: string;
  IsOk: boolean;
  IsEvent: boolean;
}
