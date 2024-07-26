import { NetAddress } from 'src/grpc-generated';

export interface RtuMgmtState {
  inProgress: boolean;
  rtuTestAddress: NetAddress | null;
  rtuTestSuccess: boolean | null;

  initializing: boolean;

  errorMessageId: string | null;
}
