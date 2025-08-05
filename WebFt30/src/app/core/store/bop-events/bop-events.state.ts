import { BopEvent } from '../models/ft30/bop-event';
import { ServerError } from '../../models/server-error';
import { EntityState } from '@ngrx/entity';

export interface BopEventsState extends EntityState<BopEvent> {
  loading: boolean;
  error: ServerError | null;
}
