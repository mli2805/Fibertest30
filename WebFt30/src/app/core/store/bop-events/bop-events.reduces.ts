import { createReducer, on } from '@ngrx/store';
import { BopEventsState } from './bop-events.state';
import { BopEventsActions } from './bop-events.actions';
import { createEntityAdapter } from '@ngrx/entity';
import { BopEvent } from '../models/ft30/bop-event';

export const BopEventsStateAdapter = createEntityAdapter<BopEvent>({
  selectId: (bopEvent: BopEvent) => bopEvent.eventId
});

export const initialState: BopEventsState = BopEventsStateAdapter.getInitialState({
  loading: false,
  error: null
});

const reducer = createReducer(
  initialState,
  on(BopEventsActions.resetError, (state) => ({
    ...state,
    error: null
  })),

  on(BopEventsActions.getBopEvents, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(BopEventsActions.getBopEventsSuccess, (state, { bopEvents }) =>
    BopEventsStateAdapter.setAll(bopEvents, {
      ...state,
      loading: false
    })
  ),
  on(BopEventsActions.getBopEventsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(BopEventsActions.loadNextBopEvents, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(BopEventsActions.loadNextBopEventsSuccess, (state, { bopEvents }) =>
    BopEventsStateAdapter.addMany(bopEvents, {
      ...state,
      loading: false
    })
  ),
  on(BopEventsActions.loadNextBopEventsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(BopEventsActions.getBopEvent, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(BopEventsActions.getBopEventSuccess, (state, { bopEvent }) => {
    return {
      ...BopEventsStateAdapter.upsertOne(bopEvent, state),
      loading: false
    };
  })
);

export function bopEventsReducer(state: BopEventsState | undefined, action: any): BopEventsState {
  return reducer(state, action);
}
