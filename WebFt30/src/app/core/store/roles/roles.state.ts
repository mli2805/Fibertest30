import { EntityState } from '@ngrx/entity';
import { Role } from '../models';

export interface RolesState extends EntityState<Role> {
  loaded: boolean;
  loading: boolean;
  errorMessageId: string | null;
}
