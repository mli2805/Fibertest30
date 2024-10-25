import { NetAddress } from '../models/ft30/net-address';

export interface RtuMgmtState {
  rtuOperationInProgress: boolean;
  rtuTestAddress: NetAddress | null;
  rtuTestSuccess: boolean | null;

  initializing: boolean;
  rtuInitializationResult: boolean | null;

  rtuOperationSuccess: boolean | null;
  measurementClientId: string | null;
  errorMessageId: string | null;
}
