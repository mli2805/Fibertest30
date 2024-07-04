import { Rtu } from '../models/ft30/rtu';

export interface RtuTreeState {
  rtuTree: Rtu[] | null;
  loaded: boolean;
  loading: boolean;
  errorMessageId: string | null;
}
