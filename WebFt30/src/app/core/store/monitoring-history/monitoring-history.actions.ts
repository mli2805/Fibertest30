import { createAction, props } from '@ngrx/store';
import { ServerError } from '../../models/server-error';
import { MonitoringResult } from '../models';

const getMonitorings = createAction(
  '[MonitoringHistory] Get Monitorings',
  props<{ monitoringPortIds: number[]; orderDescending: boolean }>()
);
const getMonitoringsSuccess = createAction(
  '[MonitoringHistory] Get Monitorings Success',
  props<{ monitorings: MonitoringResult[] }>()
);

const getMonitoringsFailure = createAction(
  '[MonitoringHistory] Get Monitorings Failure',
  props<{ error: ServerError }>()
);

const loadNextMonitorings = createAction(
  '[MonitoringHistory] LoadNext Monitorings',
  props<{ monitoringPortIds: number[]; orderDescending: boolean; lastMonitoringDateTime: Date }>()
);
const loadNextMonitoringsSuccess = createAction(
  '[MonitoringHistory] LoadNext Monitorings Success',
  props<{ monitorings: MonitoringResult[] }>()
);

const loadNextMonitoringsFailure = createAction(
  '[MonitoringHistory] LoadNext Monitorings Failure',
  props<{ error: ServerError }>()
);

const resetError = createAction('[MonitoringHistory] Reset Error');

const saveTrace = createAction(
  '[MonitoringHistory] Save Trace',
  props<{
    monitoringId: number;
    monitoringPortId: number;
    at: Date;
  }>()
);

const saveTraceSuccess = createAction(
  '[MonitoringHistory] Save Trace Success',
  props<{ monitoringPortId: number; at: Date; sor: Uint8Array }>()
);

const saveTraceAndBase = createAction(
  '[MonitoringHistory] Save Trace And Base',
  props<{
    monitoringId: number;
    monitoringPortId: number;
    at: Date;
  }>()
);

const saveTraceAndBaseSuccess = createAction(
  '[MonitoringHistory] Save Trace And Base Success',
  props<{ monitoringPortId: number; at: Date; archive: Uint8Array }>()
);

export const MonitoringHistoryActions = {
  getMonitorings,
  getMonitoringsSuccess,
  getMonitoringsFailure,
  loadNextMonitorings,
  loadNextMonitoringsSuccess,
  loadNextMonitoringsFailure,
  resetError,
  saveTrace,
  saveTraceSuccess,
  saveTraceAndBase,
  saveTraceAndBaseSuccess
};
