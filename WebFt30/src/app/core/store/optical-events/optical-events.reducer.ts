import { createReducer, on } from '@ngrx/store';
import { OpticalEventsState } from './optical-events.state';
import { OpticalEventsActions } from './optical-events.actions';

export const initialState: OpticalEventsState = {
  opticalEvents: null,
  loading: false,
  loadedTime: null,
  error: null
};

const reducer = createReducer(
  initialState,
  on(OpticalEventsActions.resetError, (state) => ({
    ...state,
    error: null
  })),
  on(OpticalEventsActions.getOpticalEvents, (state) => ({
    ...state,
    opticalEvents: null,
    loading: true,
    loadedTime: null,
    error: null
  })),
  on(OpticalEventsActions.getOpticalEventsSuccess, (state, { opticalEvents }) => ({
    ...state,
    opticalEvents,
    loading: false,
    loadedTime: new Date()
  })),
  on(OpticalEventsActions.getOpticalEventsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(OpticalEventsActions.loadNextOpticalEvents, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(OpticalEventsActions.loadNextOpticalEventsSuccess, (state, { opticalEvents }) => ({
    ...state,
    opticalEvents: state.opticalEvents ? [...state.opticalEvents, ...opticalEvents] : opticalEvents,
    loading: false,
    loadedTime: new Date()
  })),
  on(OpticalEventsActions.getOpticalEventsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export function opticalEventsReducer(
  state: OpticalEventsState | undefined,
  action: any
): OpticalEventsState {
  return reducer(state, action);
}
