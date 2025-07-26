import { createReducer, on } from '@ngrx/store';
import { RtuMgmtState } from './rtu-mgmt.state';
import { RtuMgmtActions } from './rtu-mgmt.actions';
import { ReturnCode } from '../models/ft30/return-code';

export const initialState: RtuMgmtState = {
  rtuOperationInProgress: false,

  initializing: false,
  rtuInitializationResult: null,

  mainChannelTesting: false,
  mainChannelAddress: null,
  mainChannelSuccess: null,
  mainChannelErrorId: null,

  reserveChannelTesting: false,
  reserveChannelAddress: null,
  reserveChannelSuccess: null,
  reserveChannelErrorId: null,

  rtuOperationSuccess: null,
  measurementClientId: null,

  outOfTurnTraceId: null,
  outOfTurnSorFileId: null,

  errorMessageId: null
};

const reducer = createReducer(
  initialState,

  on(RtuMgmtActions.reset, (state) => ({
    ...state,
    rtuOperationInProgress: false,
    rtuOperationSuccess: null,
    errorMessageId: null,

    mainChannelSuccess: null,
    mainChannelErrorId: null,
    reserveChannelSuccess: null,
    reserveChannelErrorId: null
  })),

  on(RtuMgmtActions.setSpinner, (state, { value }) => ({
    ...state,
    rtuOperationInProgress: value
  })),

  on(RtuMgmtActions.testMainChannel, (state, { netAddress }) => ({
    ...state,
    mainChannelTesting: true,
    mainChannelAddress: netAddress,
    mainChannelSuccess: null,
    mainChannelErrorId: null
  })),
  on(RtuMgmtActions.testMainChannelSuccess, (state, { netAddress, isConnectionSuccessful }) => ({
    ...state,
    mainChannelTesting: false,
    mainChannelAddress: netAddress ?? null,
    mainChannelSuccess: isConnectionSuccessful
  })),
  on(RtuMgmtActions.testMainChannelFailure, (state, { errorMessageId }) => ({
    ...state,
    mainChannelTesting: false,
    mainChannelErrorId: errorMessageId
  })),

  on(RtuMgmtActions.testReserveChannel, (state, { netAddress }) => ({
    ...state,
    reserveChannelTesting: true,
    reserveChannelAddress: netAddress,
    reserveChannelSuccess: null,
    reserveChannelErrorId: null
  })),
  on(RtuMgmtActions.testReserveChannelSuccess, (state, { netAddress, isConnectionSuccessful }) => ({
    ...state,
    reserveChannelTesting: false,
    reserveChannelAddress: netAddress ?? null,
    reserveChannelSuccess: isConnectionSuccessful
  })),
  on(RtuMgmtActions.testReserveChannelFailure, (state, { errorMessageId }) => ({
    ...state,
    reserveChannelTesting: false,
    reserveChannelErrorId: errorMessageId
  })),

  on(RtuMgmtActions.initializeRtu, (state, { dto }) => ({
    ...state,
    initializing: true,
    rtuInitializationResult: null
  })),
  on(RtuMgmtActions.initializeRtuSuccess, (state, { dto }) => ({
    ...state,
    initializing: false,
    rtuInitializationResult: dto?.isInitialized ?? false
  })),
  on(RtuMgmtActions.initializeRtuFailure, (state, { errorMessageId }) => ({
    ...state,
    initializing: false,
    errorMessageId: errorMessageId,
    rtuInitializationResult: false
  })),

  on(RtuMgmtActions.startMeasurementClient, (state, { dto }) => ({
    ...state,
    rtuOperationInProgress: true,
    rtuOperationSuccess: null,
    measurementClientId: null,
    errorMessageId: null
  })),
  on(RtuMgmtActions.startMeasurementClientSuccess, (state) => ({
    ...state,
    rtuOperationInProgress: true,
    rtuOperationSuccess: true
  })),
  on(RtuMgmtActions.startMeasurementClientFailure, (state, { errorMessageId }) => ({
    ...state,
    rtuOperationInProgress: false,
    rtuOperationSuccess: false,
    errorMessageId: errorMessageId
  })),
  on(RtuMgmtActions.measurementClientDone, (state, { measurementClientId }) => ({
    ...state,
    measurementClientId: measurementClientId,
    rtuOperationSuccess: null
  })),
  on(RtuMgmtActions.getMeasurementClientSorSuccess, (state) => ({
    ...state,
    rtuOperationInProgress: false
  })),
  on(RtuMgmtActions.cleanMeasurementClient, (state) => ({
    ...state,
    measurementClientId: null
  })),

  on(RtuMgmtActions.startPreciseMeasurementOutOfTurn, (state, { dto }) => ({
    ...state,
    rtuOperationInProgress: false,
    rtuOperationSuccess: null,
    outOfTurnTraceId: dto.portWithTrace.traceId,
    outOfTurnSorFileId: null,
    errorMessageId: null
  })),
  on(RtuMgmtActions.preciseMeasurementOutOfTurnDone, (state, { outOfTurnSorFileId }) => ({
    ...state,
    outOfTurnTraceId: null,
    outOfTurnSorFileId: outOfTurnSorFileId,
    rtuOperationInProgress: false
  })),

  on(RtuMgmtActions.stopMonitoring, (state, { rtuId }) => ({
    ...state,
    rtuOperationInProgress: true,
    rtuOperationSuccess: null,
    errorMessageId: null
  })),
  on(RtuMgmtActions.interruptMeasurementSuccess, (state) => ({
    ...state,
    outOfTurnTraceId: null,
    outOfTurnSorFileId: null
  })),

  on(RtuMgmtActions.stopMonitoringSuccess, (state) => ({
    ...state,
    rtuOperationInProgress: false,
    rtuOperationSuccess: true
  })),
  on(RtuMgmtActions.stopMonitoringFailure, (state, { errorMessageId }) => ({
    ...state,
    rtuOperationInProgress: false,
    rtuOperationSuccess: false,
    errorMessageId: errorMessageId
  })),

  on(RtuMgmtActions.applyMonitoringSettings, (state, { dto }) => ({
    ...state,
    rtuOperationInProgress: true,
    rtuOperationSuccess: null,
    errorMessageId: null
  })),
  on(RtuMgmtActions.applyMonitoringSettingsSuccess, (state, { dto }) => ({
    ...state,
    rtuOperationInProgress: false,
    rtuOperationSuccess:
      dto !== undefined ? dto.returnCode == ReturnCode.MonitoringSettingsAppliedSuccessfully : false
  })),
  on(RtuMgmtActions.applyMonitoringSettingsFailure, (state, { errorMessageId }) => ({
    ...state,
    rtuOperationInProgress: false,
    rtuOperationSuccess: false,
    errorMessageId: errorMessageId
  }))
);

export function rtuMgmtReducer(state: RtuMgmtState | undefined, action: any): RtuMgmtState {
  return reducer(state, action);
}
