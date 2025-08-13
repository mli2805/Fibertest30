import { EntityState } from '@ngrx/entity';
import { UserActionLine } from '../models/ft30/user-action-line';

export interface ReportingState {
  loading: boolean;
  errorMessageId: string | null;

  userActionLines: UserActionLine[] | null;
}
