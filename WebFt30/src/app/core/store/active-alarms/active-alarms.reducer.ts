import { createEntityAdapter } from '@ngrx/entity';
import { ActiveAlarmsState } from './active-alarms.state';
import { createReducer, on } from '@ngrx/store';
import { MonitoringAlarm, MonitoringAlarmStatus } from '../models';
import { ActiveAlarmsActions } from './active-alarms.actions';
import { DeviceActions } from '../device/device.actions';

export const ActiveAlarmsStateAdapter = createEntityAdapter<MonitoringAlarm>({
  selectId: (alarm: MonitoringAlarm) => alarm.id,
  sortComparer: (a: MonitoringAlarm, b: MonitoringAlarm) =>
    b.activeAt.getTime() - a.activeAt.getTime()
});

export const initialState: ActiveAlarmsState = ActiveAlarmsStateAdapter.getInitialState({
  loading: false,
  loadedTime: null,
  error: null
});

const reducer = createReducer(
  initialState,
  on(DeviceActions.loadDeviceInfoSuccess, (state, { deviceInfo }) => {
    return ActiveAlarmsStateAdapter.addMany(deviceInfo.activeAlarms, {
      ...state,
      loading: false,
      loadedTime: new Date()
    });
  }),
  // on(ActiveAlarmsActions.getActiveAlarms, (state) => ({
  //   ...ActiveAlarmsStateAdapter.removeAll({
  //     ...state,
  //     loading: true,
  //     loadedTime: null,
  //     error: null
  //   })
  // })),
  // on(ActiveAlarmsActions.getActiveAlarmsSuccess, (state, { activeAlarms }) => {
  //   return ActiveAlarmsStateAdapter.addMany(activeAlarms, {
  //     ...state,
  //     loading: false,
  //     loadedTime: new Date()
  //   });
  // }),
  // on(ActiveAlarmsActions.getActiveAlarmsFailure, (state, { error }) => ({
  //   ...state,
  //   loading: false,
  //   error
  // })),
  on(ActiveAlarmsActions.addOrUpdateAlarmFailure, (state, { error }) => ({
    ...state,
    error
  })),
  on(ActiveAlarmsActions.addOrUpdateAlarmSuccess, (state, { alarm }) => {
    if (alarm.status === MonitoringAlarmStatus.Resolved) {
      return ActiveAlarmsStateAdapter.removeOne(alarm.id, state);
    }

    return ActiveAlarmsStateAdapter.upsertOne(alarm, state);
  })
);

export function activeAlarmsReducer(
  state: ActiveAlarmsState | undefined,
  action: any
): ActiveAlarmsState {
  return reducer(state, action);
}
