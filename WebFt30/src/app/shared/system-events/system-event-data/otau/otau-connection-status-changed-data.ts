export interface OtauConnectionStatusChangedData {
  OtauId: number;
  IsConnected: boolean;
  OnlineAt: string | null;
  OfflineAt: string | null;
}
