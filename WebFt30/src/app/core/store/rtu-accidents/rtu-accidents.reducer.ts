import { createReducer, on } from '@ngrx/store';
import { RtuAccidentsState } from './rtu-accidents.state';
import { RtuAccidentsActions } from './rtu-accidents.actions';
import { RtuAccident } from '../models/ft30/rtu-accident';
import { createEntityAdapter } from '@ngrx/entity';

export const RtuAccidentsStateAdapter = createEntityAdapter<RtuAccident>({
  selectId: (rtuAccident: RtuAccident) => rtuAccident.id
});

export const initialState: RtuAccidentsState = RtuAccidentsStateAdapter.getInitialState({
  loading: false,
  error: null
});

const reducer = createReducer(
  initialState,
  on(RtuAccidentsActions.resetError, (state) => ({
    ...state,
    error: null
  })),

  on(RtuAccidentsActions.getRtuAccidents, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(RtuAccidentsActions.getRtuAccidentsSuccess, (state, { rtuAccidents }) =>
    RtuAccidentsStateAdapter.setAll(rtuAccidents, {
      ...state,
      loading: false
    })
  ),
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
  on(RtuAccidentsActions.loadNextRtuAccidentsSuccess, (state, { rtuAccidents }) =>
    RtuAccidentsStateAdapter.addMany(rtuAccidents, {
      ...state,
      loading: false
    })
  ),
  on(RtuAccidentsActions.loadNextRtuAccidentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(RtuAccidentsActions.getRtuAccident, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(RtuAccidentsActions.getRtuAccidentSuccess, (state, { rtuAccident }) => {
    return {
      ...RtuAccidentsStateAdapter.upsertOne(rtuAccident, state),
      loading: false
    };
  })
);

export function rtuAccidentsReducer(
  state: RtuAccidentsState | undefined,
  action: any
): RtuAccidentsState {
  return reducer(state, action);
}
