import { createSelector } from '@ngrx/store';
import { selectTestQueueState } from '../../core.state';
import { TestQueueState } from './test-queue.state';
import { OtdrTaskProgress } from '../models/task-progress';

const selectTestQueue = createSelector(selectTestQueueState, (state: TestQueueState) => state);

const selectLast = createSelector(selectTestQueue, (state: TestQueueState) => state.last);
const selectCurrent = createSelector(selectTestQueue, (state: TestQueueState) => state.current);

const selectLastCompletedMonitoringProgressByMonitoringPortId = (monitoringPortId: number) =>
  createSelector(selectLast, (progress: OtdrTaskProgress | null) => {
    if (
      progress?.monitoringPortId !== monitoringPortId ||
      progress?.taskType !== 'monitoring' ||
      progress?.status !== 'completed'
    ) {
      return null;
    }
    return progress;
  });

export const TestQueueSelectors = {
  selectLast,
  selectCurrent,
  selectLastCompletedMonitoringProgressByMonitoringPortId
};
