import { NetAddress } from '../models/ft30/net-address';

export interface RtuMgmtState {
  mainChannelTesting: boolean;
  mainChannelAddress: NetAddress | null;
  mainChannelSuccess: boolean | null;
  mainChannelErrorId: string | null;

  reserveChannelTesting: boolean;
  reserveChannelAddress: NetAddress | null;
  reserveChannelSuccess: boolean | null;
  reserveChannelErrorId: string | null;

  initializing: boolean;
  rtuInitializationResult: boolean | null;

  rtuOperationInProgress: boolean;
  rtuOperationSuccess: boolean | null;
  measurementClientId: string | null;

  outOfTurnTraceId: string | null;
  outOfTurnSorFileId: number | null;

  errorMessageId: string | null;
}
