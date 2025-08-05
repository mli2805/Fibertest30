import { EntityState } from '@ngrx/entity';
import { ServerError } from '../../models/server-error';
import { RtuAccident } from '../models/ft30/rtu-accident';

export interface RtuAccidentsState extends EntityState<RtuAccident> {
  loading: boolean;
  error: ServerError | null;
}
