import { createAction, props } from '@ngrx/store';
import { Rtu } from '../models/ft30/rtu';

const refreshRtuTree = createAction('[RtuTree] Refresh Rtu Tree');
const refreshRtuTreeSuccess = createAction(
  '[RtuTree] Refresh Rtu Tree Success',
  props<{ rtus: Rtu[] }>()
);
const refreshRtuTreeFailure = createAction(
  '[RtuTree] Refresh Rtu Tree Failure',
  props<{ errorMessageId: string }>()
);

export const RtuTreeActions = {
  refreshRtuTree,
  refreshRtuTreeSuccess,
  refreshRtuTreeFailure
};
