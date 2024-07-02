import { ServerError } from '../models/server-error';
import { User } from '../store/models/user';

export interface AuthState {
  loading: boolean;
  error: ServerError | string | null;
  token: string | null;
  user: User | null;
}
