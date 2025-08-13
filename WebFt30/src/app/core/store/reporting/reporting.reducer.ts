import { createReducer, on } from '@ngrx/store';
import { ReportingState } from './reporting.state';
import { ReportingActions } from './reporting.actions';

export const initialState: ReportingState = {
  loading: false,
  errorMessageId: null,
  userActionLines: null
};

const reducer = createReducer(
  initialState,
  on(ReportingActions.getUserActionLines, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null,
    userActionLines: null
  })),
  on(ReportingActions.getUserActionLinesSuccess, (state, { lines }) => ({
    ...state,
    loading: false,
    userActionLines: lines
  })),
  on(ReportingActions.getUserActionLinesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errorMessageId: error
  })),

  on(ReportingActions.resetError, (state) => ({
    ...state,
    error: null
  }))
);

export function reportingReducer(state: ReportingState | undefined, action: any): ReportingState {
  return reducer(state, action);
}
