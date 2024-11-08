import { createReducer, on } from '@ngrx/store';
import { RtuAccidentsState } from './rtu-accidents.state';
import { RtuAccidentsActions } from './rtu-accidents.actions';

export const initialState: RtuAccidentsState = {
  rtuAccidents: null,
  loading: false,
  loadedTime: null,
  error: null
};

const reducer = createReducer(
  initialState,
  on(RtuAccidentsActions.resetError, (state) => ({
    ...state,
    error: null
  })),

  on(RtuAccidentsActions.getRtuAccidents, (state) => ({
    ...state,
    rtuAccidents: null,
    loading: true,
    loadedTime: null,
    error: null
  })),
  on(RtuAccidentsActions.getRtuAccidentsSuccess, (state, { rtuAccidents }) => ({
    ...state,
    rtuAccidents,
    loading: false,
    loadedTime: new Date()
  })),
  on(RtuAccidentsActions.getRtuAccidentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(RtuAccidentsActions.loadNextRtuAccidents, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(RtuAccidentsActions.loadNextRtuAccidentsSuccess, (state, { rtuAccidents }) => ({
    ...state,
    rtuAccidents: state.rtuAccidents ? [...state.rtuAccidents, ...rtuAccidents] : rtuAccidents,
    loading: false,
    loadedTime: new Date()
  })),
  on(RtuAccidentsActions.loadNextRtuAccidentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export function rtuAccidentsReducer(
  state: RtuAccidentsState | undefined,
  action: any
): RtuAccidentsState {
  return reducer(state, action);
}
