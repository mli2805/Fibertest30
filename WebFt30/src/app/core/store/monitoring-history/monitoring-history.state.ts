import { ServerError } from '../../models/server-error';
import { MonitoringResult } from '../models';

export interface MonitoringHistoryState {
  monitorings: MonitoringResult[] | null;
  loading: boolean;
  loadedTime: Date | null;
  error: ServerError | null;
}
