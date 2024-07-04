import { createSelector } from '@ngrx/store';
import { selectRtuTreeState } from '../../core.state';
import { RtuTreeState } from './rtu-tree.state';

const selectRtuTree = createSelector(selectRtuTreeState, (state: RtuTreeState) => state.rtuTree);

const selectLoading = createSelector(selectRtuTreeState, (state: RtuTreeState) => state.loading);

const selectErrorMessageId = createSelector(
  selectRtuTreeState,
  (state: RtuTreeState) => state.errorMessageId
);

export const RtuTreeSelectors = {
  selectRtuTree,
  selectLoading,
  selectErrorMessageId
};
