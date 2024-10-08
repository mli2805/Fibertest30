import { createSelector } from '@ngrx/store';
import { selectRtuTreeState } from '../../core.state';
import { RtuTreeState } from './rtu-tree.state';
import { Rtu } from '../models/ft30/rtu';
import { RtuTreeStateAdapter } from './rtu-tree.reducer';

const { selectAll } = RtuTreeStateAdapter.getSelectors();

const selectRtuArray = createSelector(selectRtuTreeState, selectAll);

const selectLoading = createSelector(selectRtuTreeState, (state: RtuTreeState) => state.loading);

const selectErrorMessageId = createSelector(
  selectRtuTreeState,
  (state: RtuTreeState) => state.errorMessageId
);

const selectRtu = (rtuId: string) =>
  createSelector(selectRtuArray, (rtus: Rtu[] | null) => {
    return rtus?.find((r) => r.rtuId === rtuId) || null;
  });

const selectBop = (bopId: string) =>
  createSelector(selectRtuArray, (rtus: Rtu[] | null) => {
    if (rtus === null) return null;
    for (const rtu of rtus) {
      for (const bop of rtu.bops) {
        if (bop.bopId === bopId) return bop;
      }
    }
    return null;
  });

export const RtuTreeSelectors = {
  selectRtuArray,
  selectLoading,
  selectErrorMessageId,

  selectRtu,
  selectBop
};
