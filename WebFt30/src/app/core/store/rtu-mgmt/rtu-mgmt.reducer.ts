import { createReducer, on } from '@ngrx/store';
import { RtuMgmtState } from './rtu-mgmt.state';
import { RtuMgmtActions } from './rtu-mgmt.actions';
import { ReturnCode } from '../models/ft30/return-code';

export const initialState: RtuMgmtState = {
  rtuOperationInProgress: false,
  rtuTestAddress: null,
  rtuTestSuccess: null,

  initializing: false,
  rtuInitializationResult: null,

  rtuOperationSuccess: null,
  measurementClientId: null,
  errorMessageId: null
};

const reducer = createReducer(
  initialState,

  on(RtuMgmtActions.reset, (state) => ({
    ...state,
    rtuOperationInProgress: false,
    rtuOperationSuccess: null,
    errorMessageId: null
  })),

  on(RtuMgmtActions.setSpinner, (state, { value }) => ({
    ...state,
    rtuOperationInProgress: value
  })),

  on(RtuMgmtActions.testRtuConnection, (state, { netAddress }) => ({
    ...state,
    rtuOperationInProgress: true,
    rtuConnectionAddress: netAddress,
    rtuTestSuccess: null,
    errorMessageId: null
  })),
  on(RtuMgmtActions.testRtuConnectionSuccess, (state, { netAddress, isConnectionSuccessful }) => ({
    ...state,
    rtuOperationInProgress: false,
    rtuConnectionAddress: netAddress ?? null,
    rtuTestSuccess: isConnectionSuccessful
  })),
  on(RtuMgmtActions.testRtuConnectionFailure, (state, { errorMessageId }) => ({
    ...state,
    rtuOperationInProgress: false,
    errorMessageId: errorMessageId
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
    measurementClientId: measurementClientId
  })),
  on(RtuMgmtActions.getMeasurementClientSorSuccess, (state) => ({
    ...state,
    rtuOperationInProgress: false
  })),

  on(RtuMgmtActions.stopMonitoring, (state, { rtuId }) => ({
    ...state,
    rtuOperationInProgress: true,
    rtuOperationSuccess: null,
    errorMessageId: null
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
