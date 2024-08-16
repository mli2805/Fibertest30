import { createSelector } from '@ngrx/store';
import { selectRtuMgmtState } from '../../core.state';
import { RtuMgmtState } from './rtu-mgmt.state';

const selectRtuOperationInProgress = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.rtuOperationInProgress
);
const selectRtuOperationSuccess = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.rtuOperationSuccess
);
const selectInitializing = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.initializing
);
const selectRtuInitializationResult = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.rtuInitializationResult
);

const selectRtuAddress = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.rtuTestAddress
);
const selectIsTestSuccessful = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.rtuTestSuccess
);

const selectMeasurementClientId = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.measurementClientId
);
const selectErrorMessageId = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.errorMessageId
);

export const RtuMgmtSelectors = {
  selectRtuOperationInProgress,
  selectRtuOperationSuccess,
  selectInitializing,
  selectRtuInitializationResult,
  selectRtuAddress,
  selectIsTestSuccessful,
  selectMeasurementClientId,
  selectErrorMessageId
};
