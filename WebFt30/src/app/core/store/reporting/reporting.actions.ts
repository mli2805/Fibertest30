import { createAction, props } from '@ngrx/store';
import { LogOperationCode, UserActionLine } from '../models/ft30/user-action-line';
import { DateTimeRange } from 'src/grpc-generated/events.data';

const getUserActionLines = createAction(
  '[Reporting] Get User Action Lines',
  props<{ userId: string; searchWindow: DateTimeRange; operationCodes: LogOperationCode[] }>()
);
const getUserActionLinesSuccess = createAction(
  '[Reporting] Get User Action Lines Success',
  props<{ lines: UserActionLine[] }>()
);
const getUserActionLinesFailure = createAction(
  '[Reporting] Get User Action Lines Failure',
  props<{ error: string }>()
);

const resetError = createAction('[Reporting] Reset Error');

const getUserActionsPdf = createAction(
  '[Reporting] Get User Actions Pdf',
  props<{ userId: string; searchWindow: DateTimeRange; operationCodes: LogOperationCode[] }>()
);
const getUserActionsPdfSuccess = createAction(
  '[Reporting] Get User Actions Pdf Success',
  props<{ pdf: Uint8Array }>()
);

export const ReportingActions = {
  getUserActionLines,
  getUserActionLinesSuccess,
  getUserActionLinesFailure,

  getUserActionsPdf,
  getUserActionsPdfSuccess,

  resetError
};
