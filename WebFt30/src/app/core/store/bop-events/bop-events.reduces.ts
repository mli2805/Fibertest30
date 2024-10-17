import { createReducer, on } from '@ngrx/store';
import { BopEventsState } from './bop-events.state';
import { BopEventsActions } from './bop-events.actions';

export const initialState: BopEventsState = {
  bopEvents: null,
  loading: false,
  loadedTime: null,
  error: null
};

const reducer = createReducer(
  initialState,
  on(BopEventsActions.resetError, (state) => ({
    ...state,
    error: null
  })),
  on(BopEventsActions.getBopEvents, (state) => ({
    ...state,
    bopEvents: null,
    loading: true,
    loadedTime: null,
    error: null
  })),
  on(BopEventsActions.getBopEventsSuccess, (state, { bopEvents }) => ({
    ...state,
    bopEvents,
    loading: false,
    loadedTime: new Date()
  })),
  on(BopEventsActions.getBopEventsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export function bopEventsReducer(state: BopEventsState | undefined, action: any): BopEventsState {
  return reducer(state, action);
}
