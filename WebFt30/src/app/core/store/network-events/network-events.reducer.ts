import { createReducer, on } from '@ngrx/store';
import { NetworkEventsState } from './network-events.state';
import { NetworkEventsActions } from './network-events.actions';
import { createEntityAdapter } from '@ngrx/entity';
import { NetworkEvent } from '../models/ft30/network-event';

export const NetworkEventsStateAdapter = createEntityAdapter<NetworkEvent>({
  selectId: (networkEvent: NetworkEvent) => networkEvent.eventId
});

export const initialState: NetworkEventsState = NetworkEventsStateAdapter.getInitialState({
  loading: false,
  error: null
});

const reducer = createReducer(
  initialState,
  on(NetworkEventsActions.resetError, (state) => ({
    ...state,
    error: null
  })),

  on(NetworkEventsActions.getNetworkEvents, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(NetworkEventsActions.getNetworkEventsSuccess, (state, { networkEvents }) =>
    NetworkEventsStateAdapter.setAll(networkEvents, {
      ...state,
      loading: false
    })
  ),
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
  on(NetworkEventsActions.loadNextNetworkEventsSuccess, (state, { networkEvents }) =>
    NetworkEventsStateAdapter.addMany(networkEvents, {
      ...state,
      loading: false
    })
  ),
  on(NetworkEventsActions.loadNextNetworkEventsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(NetworkEventsActions.getNetworkEvent, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(NetworkEventsActions.getNetworkEventSuccess, (state, { networkEvent }) => {
    return {
      ...NetworkEventsStateAdapter.upsertOne(networkEvent, state),
      loading: false
    };
  })
);

export function networkEventsReducer(
  state: NetworkEventsState | undefined,
  action: any
): NetworkEventsState {
  return reducer(state, action);
}
