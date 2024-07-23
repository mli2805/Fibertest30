import { createReducer, on } from '@ngrx/store';
import { RtuMgmtState } from './rtu-mgmt.state';
import { RtuMgmtActions } from './rtu-mgmt.actions';

export const initialState: RtuMgmtState = {
  inProgress: false,
  rtuTestAddress: null,
  rtuTestSuccess: null,
  errorMessageId: null
};

const reducer = createReducer(
  initialState,

  on(RtuMgmtActions.testRtuConnection, (state, { netAddress }) => ({
    ...state,
    inProgress: true,
    rtuConnectionAddress: netAddress,
    rtuTestSuccess: null,
    errorMessageId: null
  })),
  on(RtuMgmtActions.testRtuConnectionSuccess, (state, { netAddress, isConnectionSuccessful }) => ({
    ...state,
    inProgress: false,
    rtuConnectionAddress: netAddress ?? null,
    rtuTestSuccess: isConnectionSuccessful
  })),
  on(RtuMgmtActions.testRtuConnectionFailure, (state, { errorMessageId }) => ({
    ...state,
    inProgress: false,
    errorMessageId: errorMessageId
  }))
);

export function rtuMgmtReducer(state: RtuMgmtState | undefined, action: any): RtuMgmtState {
  return reducer(state, action);
}
