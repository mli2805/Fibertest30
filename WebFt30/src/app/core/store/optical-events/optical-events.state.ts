import { EntityState } from '@ngrx/entity';
import { ServerError } from '../../models/server-error';
import { OpticalEvent } from '../models/ft30/optical-event';

export interface OpticalEventsState extends EntityState<OpticalEvent> {
  loading: boolean;
  error: ServerError | null;
}
