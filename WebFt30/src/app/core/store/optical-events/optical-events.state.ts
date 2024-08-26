import { ServerError } from '../../models/server-error';
import { OpticalEvent } from '../models/ft30/optical-event';

export interface OpticalEventsState {
  opticalEvents: OpticalEvent[] | null;
  loading: boolean;
  loadedTime: Date | null;
  error: ServerError | null;
}
