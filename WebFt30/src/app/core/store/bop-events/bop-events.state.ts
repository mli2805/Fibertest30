import { BopEvent } from '../models/ft30/bop-event';
import { ServerError } from '../../models/server-error';

export interface BopEventsState {
  bopEvents: BopEvent[] | null;
  loading: boolean;
  loadedTime: Date | null;
  error: ServerError | null;
}
