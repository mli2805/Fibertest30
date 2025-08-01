import { createReducer, on } from '@ngrx/store';
import { OpticalEventsState } from './optical-events.state';
import { OpticalEventsActions } from './optical-events.actions';
import { createEntityAdapter } from '@ngrx/entity';
import { OpticalEvent } from '../models/ft30/optical-event';

export const OpticalEventsStateAdapter = createEntityAdapter<OpticalEvent>({
  selectId: (opticalEvent: OpticalEvent) => opticalEvent.eventId
});

export const initialState: OpticalEventsState = OpticalEventsStateAdapter.getInitialState({
  loading: false,
  loadedTime: null,
  error: null
});

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
  on(OpticalEventsActions.getOpticalEventsSuccess, (state, { opticalEvents }) =>
    OpticalEventsStateAdapter.setAll(opticalEvents, {
      ...state,
      loading: false,
      loadedTime: new Date()
    })
  ),
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
  on(OpticalEventsActions.loadNextOpticalEventsSuccess, (state, { opticalEvents }) =>
    OpticalEventsStateAdapter.addMany(opticalEvents, {
      ...state,
      loading: false,
      loadedTime: new Date()
    })
  ),
  on(OpticalEventsActions.getOpticalEventsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(OpticalEventsActions.getOpticalEvent, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(OpticalEventsActions.getOpticalEventSuccess, (state, { opticalEvent }) => {
    return {
      ...OpticalEventsStateAdapter.upsertOne(opticalEvent, state),
      loading: false
    };
  })
);

export function opticalEventsReducer(
  state: OpticalEventsState | undefined,
  action: any
): OpticalEventsState {
  return reducer(state, action);
}
