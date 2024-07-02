import { createAction, props } from '@ngrx/store';
import { ServerError } from '../../models/server-error';
import { MeasurementSettings, OtauPortPath } from '../models';
import { OtdrTaskProgress } from '../models/task-progress';

const setOtauPortPath = createAction(
  '[OnDemand] Set Otau Port Path',
  props<{ otauPortPath: OtauPortPath }>()
);

const setMeasurementSettings = createAction(
  '[OnDemand] Set Measurement Settings',
  props<{ measurementSettings: MeasurementSettings }>()
);

const startOnDemand = createAction(
  '[OnDemand] Start OnDemand',
  props<{ monitoringPortId: number; measurementSettings: MeasurementSettings }>()
);

const startOnDemandSuccess = createAction(
  '[OnDemand] Start OnDemand Success',
  props<{ otdrTaskId: string; monitoringPortId: number }>()
);

const startOnDemandFailure = createAction(
  '[OnDemand] Start OnDemand Failure',
  props<{ error: ServerError }>()
);

const stopOnDemand = createAction('[OnDemand] Stop OnDemand', props<{ otdrTaskId: string }>());

const stopOnDemandSuccess = createAction('[OnDemand] Stop OnDemand Success');

const stopOnDemandFailure = createAction(
  '[OnDemand] Stop OnDemand Failure',
  props<{ error: ServerError }>()
);

const onDemandProgress = createAction(
  '[OnDemand] OnDemand Progress',
  props<{ progress: OtdrTaskProgress }>()
);

const onDemandFinished = createAction(
  '[OnDemand] OnDemand Finished',
  props<{ progress: OtdrTaskProgress }>()
);

const getOnDemandProgressTrace = createAction(
  '[OnDemand] Get OnDemand Progress Trace',
  props<{ otdrTaskId: string }>()
);

const getOnDemandProgressTraceSuccess = createAction(
  '[OnDemand] Get OnDemand Progress Trace Success'
);

const getCompletedOnDemandTrace = createAction(
  '[OnDemand] Get Completed OnDemand Trace',
  props<{ otdrTaskId: string }>()
);

const getCompletedOnDemandTraceSuccess = createAction(
  '[OnDemand] Get Completed OnDemand Trace Success'
);

const getCompletedOnDemandTraceFailure = createAction(
  '[OnDemand] Get Completed OnDemand Trace Failure',
  props<{ error: ServerError }>()
);

const saveTrace = createAction(
  '[OnDemand] Save Trace',
  props<{ onDemandId: string; monitoringPortId: number; at: Date }>()
);

const saveTraceSuccess = createAction(
  '[OnDemand] Save Trace Success',
  props<{ monitoringPortId: number; at: Date; sor: Uint8Array }>()
);

export const OnDemandActions = {
  setOtauPortPath,
  setMeasurementSettings,
  startOnDemand,
  startOnDemandSuccess,
  startOnDemandFailure,
  stopOnDemand,
  stopOnDemandSuccess,
  stopOnDemandFailure,
  onDemandProgress,
  onDemandFinished,
  getOnDemandProgressTrace,
  getOnDemandProgressTraceSuccess,
  getCompletedOnDemandTrace,
  getCompletedOnDemandTraceSuccess,
  getCompletedOnDemandTraceFailure,
  saveTrace,
  saveTraceSuccess
};
