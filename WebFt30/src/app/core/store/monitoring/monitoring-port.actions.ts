import { createAction, props } from '@ngrx/store';
import { MonitoringPortStatus } from 'src/grpc-generated';
import { MonitoringPort } from '../models';
import { MonitoringSchedule } from '../models/monitoring-schedule';

const setPortStatus = createAction(
  '[MonitoringPort] Set Port Status',
  props<{
    monitoringPortId: number;
    status: MonitoringPortStatus;
  }>()
);

const setPortStatusSuccess = createAction(
  '[MonitoringPort] Set Port Status Success',
  props<{ monitoringPortId: number }>()
);
const setPortStatusFailure = createAction(
  '[MonitoringPort] Set Port Status Failure',
  props<{ errorMessageId: string }>()
);

const updatePortGetPort = createAction(
  '[MonitoringPort] Update Port Get Port',
  props<{ monitoringPortId: number }>()
);
const updatePortGetPortSuccess = createAction(
  '[MonitoringPort] Update Port Get Port Success',
  props<{ monitoringPort: MonitoringPort }>()
);

const updatePortGetPortFailure = createAction(
  '[MonitoringPort] Update Port Get Port Failure',
  props<{ errorMessageId: string }>()
);

const refreshOtauMonitoringPorts = createAction(
  '[MonitoringPort] Refresh Otau Monitoring Ports',
  props<{ otauId: number }>()
);

const refreshOtauMonitoringPortsSuccess = createAction(
  '[MonitoringPort] Refresh Otau Monitoring Ports Success',
  props<{ monitoringPorts: MonitoringPort[] }>()
);

const refreshOtauMonitoringPortsFailure = createAction(
  '[MonitoringPort] Refresh Otau Monitoring Ports Failure',
  props<{ errorMessageId: string }>()
);

const resetError = createAction('[MonitoringPort] Reset Error');

const setPortSchedule = createAction(
  '[MonitoringPort] Set Port Schedule',
  props<{
    monitoringPortId: number;
    schedule: MonitoringSchedule;
  }>()
);
const setPortScheduleSuccess = createAction(
  '[MonitoringPort] Set Port Schedule Success',
  props<{ monitoringPortId: number }>()
);
const setPortScheduleFailure = createAction(
  '[MonitoringPort] Set Port Schedule Failure',
  props<{ errorMessageId: string }>()
);

export const MonitoringPortActions = {
  setPortStatus,
  setPortStatusSuccess,
  setPortStatusFailure,
  resetError,

  updatePortGetPort,
  updatePortGetPortSuccess,
  updatePortGetPortFailure,

  refreshOtauMonitoringPorts,
  refreshOtauMonitoringPortsSuccess,
  refreshOtauMonitoringPortsFailure,

  setPortSchedule,
  setPortScheduleSuccess,
  setPortScheduleFailure
};
