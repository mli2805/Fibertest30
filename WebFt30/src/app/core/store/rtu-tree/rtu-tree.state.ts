import { EntityState } from '@ngrx/entity';
import { Rtu } from '../models/ft30/rtu';

export interface RtuTreeState extends EntityState<Rtu> {
  loaded: boolean;
  loading: boolean;
  errorMessageId: string | null;
}
