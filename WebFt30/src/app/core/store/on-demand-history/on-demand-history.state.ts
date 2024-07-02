import { ServerError } from '../../models/server-error';
import { CompletedOnDemand } from '../models';

export interface OnDemandHistoryState {
  onDemands: CompletedOnDemand[] | null;
  loading: boolean;
  loadedTime: Date | null;
  error: ServerError | null;
  higlightOnDemandId: string | null;
}
