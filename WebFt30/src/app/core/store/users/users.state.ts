import { EntityState } from '@ngrx/entity';
import { User } from '../models/user';

export interface UsersState extends EntityState<User> {
  loaded: boolean;
  loading: boolean;
  errorMessageId: string | null;
}
