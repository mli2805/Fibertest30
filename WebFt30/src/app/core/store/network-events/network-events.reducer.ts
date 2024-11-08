import { createReducer, on } from '@ngrx/store';
import { NetworkEventsState } from './network-events.state';
import { NetworkEventsActions } from './network-events.actions';

export const initialState: NetworkEventsState = {
  networkEvents: null,
  loading: false,
  loadedTime: null,
  error: null
};

const reducer = createReducer(
  initialState,
  on(NetworkEventsActions.resetError, (state) => ({
    ...state,
    error: null
  })),

  on(NetworkEventsActions.getNetworkEvents, (state) => ({
    ...state,
    networkEvents: null,
    loading: true,
    loadedTime: null,
    error: null
  })),
  on(NetworkEventsActions.getNetworkEventsSuccess, (state, { networkEvents }) => ({
    ...state,
    networkEvents,
    loading: false,
    loadedTime: new Date()
  })),
  on(NetworkEventsActions.getNetworkEventsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(NetworkEventsActions.loadNextNetworkEvents, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(NetworkEventsActions.loadNextNetworkEventsSuccess, (state, { networkEvents }) => ({
    ...state,
    networkEvents: state.networkEvents ? [...state.networkEvents, ...networkEvents] : networkEvents,
    loading: false,
    loadedTime: new Date()
  })),
  on(NetworkEventsActions.loadNextNetworkEventsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export function networkEventsReducer(
  state: NetworkEventsState | undefined,
  action: any
): NetworkEventsState {
  return reducer(state, action);
}
