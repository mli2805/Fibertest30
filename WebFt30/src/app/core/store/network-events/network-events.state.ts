import { EntityState } from '@ngrx/entity';
import { ServerError } from '../../models/server-error';
import { NetworkEvent } from '../models/ft30/network-event';

export interface NetworkEventsState extends EntityState<NetworkEvent> {
  loading: boolean;
  error: ServerError | null;
}
