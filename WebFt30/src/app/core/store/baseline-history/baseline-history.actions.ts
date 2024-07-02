import { createAction, props } from '@ngrx/store';
import { ServerError } from '../../models/server-error';
import { MonitoringBaseline } from '../models';

const resetError = createAction('[BaselineHistory] Reset Error');

const getBaselines = createAction(
  '[BaselineHistory] Get Baselines',
  props<{ monitoringPortIds: number[] }>()
);

const getBaselinesSuccess = createAction(
  '[BaselineHistory] Get Baselines Success',
  props<{ baselines: MonitoringBaseline[] }>()
);

const getBaselinesFailure = createAction(
  '[BaselineHistory] Get Baselines Failure',
  props<{ error: ServerError }>()
);

const saveBase = createAction(
  '[BaselineHistory] Save Base',
  props<{ baselineId: number; monitoringPortId: number; at: Date }>()
);
const saveBaseSuccess = createAction(
  '[BaselineHistory] Save Base Success',
  props<{ monitoringPortId: number; at: Date; sor: Uint8Array }>()
);

export const BaselineHistoryActions = {
  resetError,
  getBaselines,
  getBaselinesSuccess,
  getBaselinesFailure,
  saveBase,
  saveBaseSuccess
};
