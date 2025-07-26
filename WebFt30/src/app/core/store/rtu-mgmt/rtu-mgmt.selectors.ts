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

///
const selectMainChannelAddress = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.mainChannelAddress
);
const selectMainChannelTesting = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.mainChannelTesting
);
const selectMainChannelSuccess = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.mainChannelSuccess
);
const selectMainChannelErrorId = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.mainChannelErrorId
);
///
const selectReserveChannelAddress = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.reserveChannelAddress
);
const selectReserveChannelTesting = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.reserveChannelTesting
);
const selectReserveChannelSuccess = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.reserveChannelSuccess
);
const selectReserveChannelErrorId = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.reserveChannelErrorId
);
///

const selectMeasurementClientId = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.measurementClientId
);

const selectOutOfTurnTraceId = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.outOfTurnTraceId
);
const selectOutOfTurnSorFileId = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.outOfTurnSorFileId
);

const selectErrorMessageId = createSelector(
  selectRtuMgmtState,
  (state: RtuMgmtState) => state.errorMessageId
);

export const RtuMgmtSelectors = {
  selectRtuOperationInProgress,
  selectRtuOperationSuccess,

  selectMainChannelTesting,
  selectMainChannelAddress,
  selectMainChannelSuccess,
  selectMainChannelErrorId,

  selectReserveChannelTesting,
  selectReserveChannelAddress,
  selectReserveChannelSuccess,
  selectReserveChannelErrorId,

  selectInitializing,
  selectRtuInitializationResult,
  selectMeasurementClientId,

  selectOutOfTurnTraceId,
  selectOutOfTurnSorFileId,

  selectErrorMessageId
};
