import { EntityState } from '@ngrx/entity';
import { AlarmProfile } from '../models/alarm-profile';

export interface AlarmProfilesState extends EntityState<AlarmProfile> {
  loaded: boolean;
  loading: boolean;
  errorMessageId: string | null;
}
