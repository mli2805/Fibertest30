import { createReducer, on } from '@ngrx/store';
import { AlarmEventsState } from './alarm-events.state';
import { AlarmEventsActions } from './alarm-events.actions';

export const initialState: AlarmEventsState = {
  alarmEvents: null,
  loading: false,
  loadedTime: null,
  error: null
};

const reducer = createReducer(
  initialState,
  on(AlarmEventsActions.resetError, (state) => ({
    ...state,
    error: null
  })),
  on(AlarmEventsActions.getAlarmEvents, (state) => ({
    ...state,
    alarmEvents: null,
    loading: true,
    loadedTime: null,
    error: null
  })),
  on(AlarmEventsActions.getAlarmEventsSuccess, (state, { alarmEvents }) => ({
    ...state,
    alarmEvents,
    loading: false,
    loadedTime: new Date()
  })),
  on(AlarmEventsActions.getAlarmEventsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export function alarmEventsReducer(
  state: AlarmEventsState | undefined,
  action: any
): AlarmEventsState {
  return reducer(state, action);
}
