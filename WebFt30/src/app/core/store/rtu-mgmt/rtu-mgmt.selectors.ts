import { createSelector } from '@ngrx/store';
import { selectRtuMgmtState } from '../../core.state';
import { RtuMgmtState } from './rtu-mgmt.state';

const selectInProgress = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.inProgress
);

const selectRtuAddress = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.rtuTestAddress
);
const selectIsTestSuccessful = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.rtuTestSuccess
);
const selectErrorMessageId = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.errorMessageId
);

export const RtuMgmtSelectors = {
  selectInProgress,
  selectRtuAddress,
  selectIsTestSuccessful,
  selectErrorMessageId
};
