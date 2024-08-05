import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import { MonitoringPortState } from './monitoring-port.state';
import { MonitoringPortActions } from './monitoring-port.actions';
import { MonitoringPort } from '../models';
import { DeviceActions } from '../device/device.actions';
import { OtausActions } from '../otaus/otaus.actions';

export const MonitoringPortStateAdapter = createEntityAdapter<MonitoringPort>({
  selectId: (monitoringPort: MonitoringPort) => monitoringPort.id
});

export const initialState: MonitoringPortState = MonitoringPortStateAdapter.getInitialState({
  loading: false,
  errorMessageId: null,
  timeSlots: []
});

const reducer = createReducer(
  initialState,
  on(DeviceActions.loadDeviceInfo, (state) => {
    return MonitoringPortStateAdapter.removeAll({
      ...state
    });
  }),
  on(DeviceActions.loadDeviceInfoSuccess, (state, { deviceInfo }) => {
    return MonitoringPortStateAdapter.setAll(deviceInfo.monitoringPorts, {
      ...state,
      timeSlots: deviceInfo.monitoringTimeSlots
    });
  }),
  on(MonitoringPortActions.setPortStatus, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  })),
  on(MonitoringPortActions.setPortStatusFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  })),

  on(MonitoringPortActions.setPortStatusSuccess, (state) => ({
    ...state,
    loading: true
  })),
  on(MonitoringPortActions.resetError, (state) => ({
    ...state,
    errorMessageId: null
  })),
  on(MonitoringPortActions.updatePortGetPort, (state) => ({
    ...state,
    loading: true
  })),
  on(MonitoringPortActions.updatePortGetPortSuccess, (state, { monitoringPort }) => {
    return MonitoringPortStateAdapter.updateOne(
      { id: monitoringPort.id, changes: monitoringPort },
      {
        ...state,
        loading: false
      }
    );
  }),
  on(MonitoringPortActions.updatePortGetPortFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  })),
  on(OtausActions.removeOtauSuccess, (state, { otauId }) => {
    const idsToRemove = Object.values(state.entities)
      .filter((x) => x?.otauId === otauId)
      .map((x) => x!.id);
    return MonitoringPortStateAdapter.removeMany(idsToRemove, state);
  }),
  on(MonitoringPortActions.refreshOtauMonitoringPorts, (state) => ({
    ...state,
    loading: true
  })),
  on(MonitoringPortActions.refreshOtauMonitoringPortsSuccess, (state, { monitoringPorts }) => {
    return MonitoringPortStateAdapter.upsertMany(monitoringPorts, {
      ...state,
      loading: false
    });
  }),
  on(MonitoringPortActions.refreshOtauMonitoringPortsFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  })),

  on(MonitoringPortActions.setPortSchedule, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  })),
  on(MonitoringPortActions.setPortScheduleFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  })),
  on(MonitoringPortActions.setPortScheduleSuccess, (state) => ({
    ...state,
    loading: true
  }))
);

export function monitoringPortReducer(
  state: MonitoringPortState | undefined,
  action: any
): MonitoringPortState {
  return reducer(state, action);
}
