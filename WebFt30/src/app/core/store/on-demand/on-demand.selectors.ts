import { createSelector } from '@ngrx/store';

import { selectOnDemandState } from '../../core.state';
import { OnDemandState } from './on-demand.state';
import { ServerError } from '../../models/server-error';
import { CoreUtils } from '../../core.utils';
import { OtdrTask } from '../models/task-progress';

const selectOnDemand = createSelector(selectOnDemandState, (state: OnDemandState) => state);

const selectMeasurementSettings = createSelector(
  selectOnDemand,
  (state: OnDemandState) => state.measurementSettings
);

const selectOtauPortPath = createSelector(
  selectOnDemand,
  (state: OnDemandState) => state.otauPortPath
);

const selectTask = createSelector(selectOnDemand, (state: OnDemandState) => state.otdrTask);
const selectOtdrTaskId = createSelector(selectTask, (task: OtdrTask | null) =>
  OtdrTask.getOtdrTaskId(task)
);
const selectStarting = createSelector(selectTask, (task: OtdrTask | null) =>
  OtdrTask.getStarting(task)
);
const selectStarted = createSelector(selectTask, (task: OtdrTask | null) =>
  OtdrTask.getStarted(task)
);
const selectProgress = createSelector(selectTask, (task: OtdrTask | null) =>
  OtdrTask.getProgress(task)
);
const selectCancelling = createSelector(selectTask, (task: OtdrTask | null) =>
  OtdrTask.getCancelling(task)
);
const selectCancelled = createSelector(selectTask, (task: OtdrTask | null) =>
  OtdrTask.getCancelled(task)
);
const selectShowStart = createSelector(selectTask, (task: OtdrTask | null) =>
  OtdrTask.getShowStart(task)
);
const selectPending = createSelector(selectTask, (task: OtdrTask | null) =>
  OtdrTask.getPending(task)
);
const selectRunning = createSelector(selectTask, (task: OtdrTask | null) =>
  OtdrTask.getRunning(task)
);
const selectCompleted = createSelector(selectTask, (task: OtdrTask | null) =>
  OtdrTask.getCompleted(task)
);
const selectFinishedDate = createSelector(selectTask, (task: OtdrTask | null) =>
  OtdrTask.getFinishedDate(task)
);

const selectError = createSelector(selectTask, (task: OtdrTask | null) => OtdrTask.getError(task));
const selectErrorMessageId = createSelector(selectError, (error: ServerError | string | null) => {
  return CoreUtils.commonErrorToMessageId(error, 'i18n.on-demand.error.error-peforming-ondemand');
});

export const OnDemandSelectors = {
  selectOnDemand,
  selectMeasurementSettings,
  selectOtauPortPath,
  selectTask,
  selectOtdrTaskId,
  selectStarting,
  selectStarted,
  selectCancelled,
  selectCancelling,
  selectPending,
  selectRunning,
  selectCompleted,
  selectShowStart,
  selectProgress,
  selectErrorMessageId,
  selectFinishedDate
};
