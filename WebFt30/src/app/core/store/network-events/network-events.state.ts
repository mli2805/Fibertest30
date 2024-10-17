import { ServerError } from '../../models/server-error';
import { NetworkEvent } from '../models/ft30/network-event';

export interface NetworkEventsState {
  networkEvents: NetworkEvent[] | null;
  loading: boolean;
  loadedTime: Date | null;
  error: ServerError | null;
}
