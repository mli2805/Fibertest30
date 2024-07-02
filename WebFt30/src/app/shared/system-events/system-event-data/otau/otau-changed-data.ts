export interface OtauChangedData {
  OtauId: number;
  OldSerialNumber: string;
  NewSerialNumber: string;
  OldPortCount: number | null;
  NewPortCount: number | null;
}
