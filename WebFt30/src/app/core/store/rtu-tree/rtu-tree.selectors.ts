import { createSelector } from '@ngrx/store';
import { selectRtuTreeState } from '../../core.state';
import { RtuTreeState } from './rtu-tree.state';
import { Rtu } from '../models/ft30/rtu';

const selectRtuTree = createSelector(selectRtuTreeState, (state: RtuTreeState) => state.rtuTree);

const selectLoading = createSelector(selectRtuTreeState, (state: RtuTreeState) => state.loading);

const selectErrorMessageId = createSelector(
  selectRtuTreeState,
  (state: RtuTreeState) => state.errorMessageId
);

const selectRtu = (rtuId: string) =>
  createSelector(selectRtuTree, (rtus: Rtu[] | null) => {
    return rtus?.find((r) => r.rtuId === rtuId) || null;
  });

export const RtuTreeSelectors = {
  selectRtuTree,
  selectLoading,
  selectErrorMessageId,

  selectRtu
};
