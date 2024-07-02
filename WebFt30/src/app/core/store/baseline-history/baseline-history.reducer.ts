import { createReducer, on } from '@ngrx/store';
import { BaselineHistoryState } from './baseline-history.state';
import { BaselineHistoryActions } from './baseline-history.actions';

export const initialState: BaselineHistoryState = {
  baselines: null,
  loading: false,
  loadedTime: null,
  error: null
};

const reducer = createReducer(
  initialState,

  on(BaselineHistoryActions.resetError, (state) => ({
    ...state,
    error: null
  })),
  on(BaselineHistoryActions.getBaselines, (state) => ({
    ...state,
    loading: true,
    loadedTime: null,
    error: null
  })),
  on(BaselineHistoryActions.getBaselinesSuccess, (state, { baselines }) => ({
    ...state,
    baselines,
    loading: false,
    loadedTime: new Date()
  })),
  on(BaselineHistoryActions.getBaselinesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export function baselineHistoryReducer(
  state: BaselineHistoryState | undefined,
  action: any
): BaselineHistoryState {
  return reducer(state, action);
}
