import { createSelector } from '@ngrx/store';
import { selectBaselineSetupState } from '../../core.state';
import { BaselineSetupStateAdapter } from './baseline-setup.reducer';
import { BaselineSetupState } from './baseline-setup.state';
import { BaselineSetup } from '../models';
import { OtdrTask } from '../models/task-progress';
import { ServerError } from '../../models/server-error';
import { CoreUtils } from '../../core.utils';

const { selectIds, selectEntities, selectAll, selectTotal } =
  BaselineSetupStateAdapter.getSelectors();

const selectBaselineSetup = createSelector(
  selectBaselineSetupState,
  (state: BaselineSetupState) => state
);

const selectBaselineSetupEntities = createSelector(selectBaselineSetup, selectEntities);

export const selectBaselineSetupById = (monitoringPortId: number) =>
  createSelector(selectBaselineSetup, (state: BaselineSetupState) => {
    return state.entities[monitoringPortId] || null;
  });

export const selectOtdrTaskById = (monitoringPortId: number) =>
  createSelector(selectBaselineSetupById(monitoringPortId), (entity: BaselineSetup | null) => {
    if (entity == null) {
      return null;
    }
    return entity.otdrTask;
  });

export const selectStartingById = (monitoringPortId: number) =>
  createSelector(selectOtdrTaskById(monitoringPortId), (otdrTask: OtdrTask | null) => {
    return OtdrTask.getStarting(otdrTask);
  });

export const selectStartedById = (monitoringPortId: number) =>
  createSelector(selectOtdrTaskById(monitoringPortId), (otdrTask: OtdrTask | null) => {
    return OtdrTask.getStarted(otdrTask);
  });

export const selectShowStartById = (monitoringPortId: number) =>
  createSelector(selectOtdrTaskById(monitoringPortId), (otdrTask: OtdrTask | null) => {
    return OtdrTask.getShowStart(otdrTask);
  });

export const selectProgressById = (monitoringPortId: number) =>
  createSelector(selectOtdrTaskById(monitoringPortId), (otdrTask: OtdrTask | null) => {
    return OtdrTask.getProgress(otdrTask);
  });

export const selectCancellingById = (monitoringPortId: number) =>
  createSelector(selectOtdrTaskById(monitoringPortId), (otdrTask: OtdrTask | null) => {
    return OtdrTask.getCancelling(otdrTask);
  });

export const selectCancelledById = (monitoringPortId: number) =>
  createSelector(selectOtdrTaskById(monitoringPortId), (otdrTask: OtdrTask | null) => {
    return OtdrTask.getCancelled(otdrTask);
  });

export const selectErrorById = (monitoringPortId: number) =>
  createSelector(selectOtdrTaskById(monitoringPortId), (otdrTask: OtdrTask | null) => {
    return OtdrTask.getError(otdrTask);
  });

export const selectErrorMessageIdById = (monitoringPortId: number) =>
  createSelector(selectErrorById(monitoringPortId), (error: ServerError | string | null) => {
    return CoreUtils.commonErrorToMessageId(
      error,
      'i18n.baseline.error.error-peforming-auto-baseline'
    );
  });

export const BaselineSetupSelectors = {
  selectBaselineSetup,
  selectBaselineSetupEntities,
  selectBaselineSetupById,
  selectOtdrTaskById,
  selectStartingById,
  selectStartedById,
  selectShowStartById,
  selectProgressById,
  selectCancellingById,
  selectCancelledById,
  selectErrorMessageIdById
};
