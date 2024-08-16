import { NetAddress } from 'src/grpc-generated';

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
