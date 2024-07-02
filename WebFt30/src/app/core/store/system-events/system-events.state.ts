import { ServerError } from '../../models/server-error';
import { SystemEvent } from '../models';

export interface SystemEventsState {
  systemEvents: SystemEvent[] | null;
  loading: boolean;
  loadedTime: Date | null;
  error: ServerError | null;
}
