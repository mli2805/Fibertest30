import { createReducer, on } from '@ngrx/store';
import { SystemEventsState } from './system-events.state';
import { SystemEventsActions } from './system-events.actions';

export const initialState: SystemEventsState = {
  systemEvents: null,
  loading: false,
  loadedTime: null,
  error: null
};

const reducer = createReducer(
  initialState,
  on(SystemEventsActions.resetError, (state) => ({
    ...state,
    error: null
  })),
  on(SystemEventsActions.getSystemEvents, (state) => ({
    ...state,
    systemEvents: null,
    loading: true,
    loadedTime: null,
    error: null
  })),
  on(SystemEventsActions.getSystemEventsSuccess, (state, { systemEvents }) => ({
    ...state,
    systemEvents,
    loading: false,
    loadedTime: new Date()
  })),
  on(SystemEventsActions.getSystemEventsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export function systemEventsReducer(
  state: SystemEventsState | undefined,
  action: any
): SystemEventsState {
  return reducer(state, action);
}
