import { createReducer, on } from '@ngrx/store';
import { OnDemandHistoryState } from './on-demand-history.state';
import { OnDemandHistoryActions } from './on-demand-history.actions';

export const initialState: OnDemandHistoryState = {
  onDemands: null,
  loading: false,
  loadedTime: null,
  error: null,
  higlightOnDemandId: null
};

const reducer = createReducer(
  initialState,
  on(OnDemandHistoryActions.resetError, (state) => ({
    ...state,
    error: null
  })),
  on(OnDemandHistoryActions.getOnDemands, (state) => ({
    ...state,
    onDemands: null,
    loading: true,
    loadedTime: null,
    error: null
  })),
  on(OnDemandHistoryActions.getOnDemandsSuccess, (state, { onDemands }) => ({
    ...state,
    onDemands,
    loading: false,
    loadedTime: new Date()
  })),
  on(OnDemandHistoryActions.getOnDemandsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(OnDemandHistoryActions.higlightOnDemand, (state, { onDemandId }) => ({
    ...state,
    higlightOnDemandId: onDemandId
  })),
  on(OnDemandHistoryActions.resetHiglightOnDemand, (state) => ({
    ...state,
    higlightOnDemandId: null
  }))
);

export function onDemandHistoryReducer(
  state: OnDemandHistoryState | undefined,
  action: any
): OnDemandHistoryState {
  return reducer(state, action);
}
