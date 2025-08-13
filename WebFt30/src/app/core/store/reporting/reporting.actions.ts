import { createAction, props } from '@ngrx/store';
import { UserActionLine } from '../models/ft30/user-action-line';

const getUserActionLines = createAction('[Reporting] Get User Action Lines');
const getUserActionLinesSuccess = createAction(
  '[Reporting] Get User Action Lines Success',
  props<{ lines: UserActionLine[] }>()
);
const getUserActionLinesFailure = createAction(
  '[Reporting] Get User Action Lines Failure',
  props<{ error: string }>()
);

const resetError = createAction('[Reporting] Reset Error');

export const ReportingActions = {
  getUserActionLines,
  getUserActionLinesSuccess,
  getUserActionLinesFailure,

  resetError
};
