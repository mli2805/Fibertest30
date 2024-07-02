import { createReducer, on } from '@ngrx/store';
import { MonitoringHistoryState } from './monitoring-history.state';
import { MonitoringHistoryActions } from './monitoring-history.actions';

export const initialState: MonitoringHistoryState = {
  monitorings: null,
  loading: false,
  loadedTime: null,
  error: null
};

const reducer = createReducer(
  initialState,
  on(MonitoringHistoryActions.resetError, (state) => ({
    ...state,
    error: null
  })),
  on(MonitoringHistoryActions.getMonitorings, (state) => ({
    ...state,
    monitorings: null,
    loading: true,
    loadedTime: null,
    error: null
  })),
  on(MonitoringHistoryActions.getMonitoringsSuccess, (state, { monitorings }) => ({
    ...state,
    monitorings,
    loading: false,
    loadedTime: new Date()
  })),
  on(MonitoringHistoryActions.getMonitoringsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(MonitoringHistoryActions.loadNextMonitorings, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(MonitoringHistoryActions.loadNextMonitoringsSuccess, (state, { monitorings }) => ({
    ...state,
    monitorings: state.monitorings ? [...state.monitorings, ...monitorings] : monitorings,
    loading: false,
    loadedTime: new Date()
  })),
  on(MonitoringHistoryActions.loadNextMonitoringsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export function monitoringHistoryReducer(
  state: MonitoringHistoryState | undefined,
  action: any
): MonitoringHistoryState {
  return reducer(state, action);
}
