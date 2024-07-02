import { createReducer, on } from '@ngrx/store';
import { OnDemandState } from './on-demand.state';
import { OnDemandActions } from './on-demand.actions';
import { OtdrTask } from '../models/task-progress';

export const initialState: OnDemandState = {
  measurementSettings: null,
  otauPortPath: null,
  otdrTask: null
};

const reducer = createReducer(
  initialState,
  on(OnDemandActions.setOtauPortPath, (state, { otauPortPath }) => ({
    ...state,
    otauPortPath
  })),
  on(OnDemandActions.startOnDemand, (state, { monitoringPortId }) => ({
    ...state,
    otdrTask: OtdrTask.create(true, monitoringPortId)
  })),
  on(OnDemandActions.startOnDemandSuccess, (state, { otdrTaskId, monitoringPortId }) => ({
    ...state,
    otdrTask: OtdrTask.create(false, monitoringPortId, otdrTaskId)
  })),
  on(OnDemandActions.startOnDemandFailure, (state, { error }) => ({
    ...state,
    otdrTask: {
      ...state.otdrTask!,
      starting: false,
      error: error
    }
  })),
  on(OnDemandActions.stopOnDemand, (state) => ({
    ...state,
    otdrTask: {
      ...state.otdrTask!,
      stopping: true
    }
  })),
  on(OnDemandActions.stopOnDemandSuccess, (state) => ({
    ...state,
    progress: {
      ...state.otdrTask!,
      stopping: false
    }
  })),
  on(OnDemandActions.stopOnDemandFailure, (state, { error }) => ({
    ...state,
    otdrTask: {
      ...state.otdrTask!,
      stopping: false
    }
    // ignore the error
    // user will see that after some progress Stop button is still enabled
    // so she can try again
  })),
  on(OnDemandActions.onDemandProgress, (state, { progress }) => ({
    ...state,
    otdrTask: {
      ...state.otdrTask!,
      progress: progress
    }
  })),
  on(OnDemandActions.onDemandFinished, (state, { progress }) => ({
    ...state,
    otdrTask: {
      ...state.otdrTask!,
      stopping: false,
      finished: true,
      finishedDate: new Date(),
      error: progress.failReason
    }
  })),
  on(OnDemandActions.setMeasurementSettings, (state, { measurementSettings }) => ({
    ...state,
    measurementSettings
  })),
  on(OnDemandActions.getCompletedOnDemandTraceFailure, (state, { error }) => ({
    ...state,
    otdrTask: {
      ...state.otdrTask!,
      error: error
    }
  }))
);

export function onDemandReducer(state: OnDemandState | undefined, action: any): OnDemandState {
  return reducer(state, action);
}
