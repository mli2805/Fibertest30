import { createEntityAdapter } from '@ngrx/entity';
import { AllAlarmsState } from './all-alarms.state';
import { createReducer, on } from '@ngrx/store';
import { MonitoringAlarm, MonitoringAlarmStatus } from '../models';
import { AllAlarmsActions } from './all-alarms.actions';

export const initialState: AllAlarmsState = {
  allAlarms: null,
  loading: false,
  loadedTime: null,
  error: null
};

const reducer = createReducer(
  initialState,
  on(AllAlarmsActions.resetError, (state) => ({
    ...state,
    error: null
  })),
  on(AllAlarmsActions.getAllAlarms, (state) => ({
    ...state,
    allAlarms: null,
    loading: true,
    loadedTime: null,
    error: null
  })),
  on(AllAlarmsActions.getAllAlarmsSuccess, (state, { allAlarms }) => ({
    ...state,
    allAlarms,
    loading: false,
    loadedTime: new Date(),
    error: null
  })),
  on(AllAlarmsActions.getAllAlarmsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

export function allAlarmsReducer(state: AllAlarmsState | undefined, action: any): AllAlarmsState {
  return reducer(state, action);
}
