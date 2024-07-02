import { ServerError } from '../../models/server-error';
import { MonitoringBaseline } from '../models';

export interface BaselineHistoryState {
  baselines: MonitoringBaseline[] | null;
  loading: boolean;
  loadedTime: Date | null;
  error: ServerError | null;
}
