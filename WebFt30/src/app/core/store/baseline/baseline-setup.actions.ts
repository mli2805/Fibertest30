import { createAction, props } from '@ngrx/store';
import { OtdrTaskProgress } from '../models/task-progress';
import { ServerError } from '../../models/server-error';
import { MeasurementSettings } from '../models';

const startBaseline = createAction(
  '[BaselineSetup] Start Baseline',
  props<{
    monitoringPortId: number;
    fullAutoMode: boolean;
    measurementSettings: MeasurementSettings | null;
  }>()
);

const startBaselineSuccess = createAction(
  '[BaselineSetup] Start Baseline Success',
  props<{ monitoringPortId: number }>()
);

const startBaselineFailure = createAction(
  '[BaselineSetup] Start Baseline Failure',
  props<{ monitoringPortId: number; error: ServerError }>()
);

const stopBaseline = createAction(
  '[BaselineSetup] Stop Baseline',
  props<{ monitoringPortId: number }>()
);

const stopBaselineSuccess = createAction(
  '[BaselineSetup] Stop Baseline Success',
  props<{ monitoringPortId: number }>()
);

const stopBaselineFailure = createAction(
  '[BaselineSetup] Stop Baseline Failure',
  props<{ monitoringPortId: number; error: ServerError }>()
);

const baselineProgress = createAction(
  '[BaselineSetup] Baseline Progress',
  props<{ monitoringPortId: number; progress: OtdrTaskProgress }>()
);

const baselineFinished = createAction(
  '[BaselineSetup]  Baseline Finished',
  props<{ progress: OtdrTaskProgress; monitoringPortId: number }>()
);

const clearBaselineSetup = createAction(
  '[BaselineSetup]  Clear Baseline Setup',
  props<{ monitoringPortId: number }>()
);

const saveTrace = createAction(
  '[BaselineSetup] Save Trace',
  props<{
    baselineId: number;
    monitoringPortId: number;
    at: Date;
  }>()
);

const saveTraceSuccess = createAction(
  '[BaselineSetup] Save Trace Success',
  props<{ monitoringPortId: number; at: Date; sor: Uint8Array }>()
);

export const BaselineSetupActions = {
  startBaseline,
  startBaselineSuccess,
  startBaselineFailure,
  stopBaseline,
  stopBaselineSuccess,
  stopBaselineFailure,
  baselineProgress,
  baselineFinished,
  clearBaselineSetup,
  saveTrace,
  saveTraceSuccess
};
