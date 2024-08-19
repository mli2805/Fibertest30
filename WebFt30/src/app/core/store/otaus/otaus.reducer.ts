import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import { Otau } from '../models';
import { OtausState } from './otaus.state';
import { OtausActions } from './otaus.actions';
import { DeviceActions } from '../device/device.actions';

export const OtausStateAdapter = createEntityAdapter<Otau>({
  selectId: (otau: Otau) => otau.id
});

export const initialState: OtausState = OtausStateAdapter.getInitialState({
  loading: false,
  errorMessageId: null,
  routerSelectedOtauOcmPortIndex: null
});

const reducer = createReducer(
  initialState,
  on(OtausActions.resetError, (state) => ({
    ...state,
    errorMessageId: null
  })),
  on(DeviceActions.loadDeviceInfo, (state) => {
    return OtausStateAdapter.removeAll({
      ...state
    });
  }),
  on(DeviceActions.loadDeviceInfoSuccess, (state, { deviceInfo }) => {
    return OtausStateAdapter.setAll(deviceInfo.otaus, {
      ...state
    });
  }),
  on(
    OtausActions.otauConnectionStatusChanged,
    (state, { otauId, isConnected, onlineAt, offlineAt }) => {
      const otau = state.entities[otauId];
      if (otau) {
        const updatedOtau = { ...otau, isConnected, onlineAt, offlineAt };
        return OtausStateAdapter.updateOne(
          {
            id: otauId,
            changes: updatedOtau
          },
          state
        );
      }

      return state;
    }
  ),

  on(OtausActions.getOtau, (state) => ({
    ...state,
    loading: true
  })),
  on(OtausActions.getOtauSuccess, (state, { otau }) => {
    return OtausStateAdapter.updateOne(
      { id: otau.id, changes: otau },
      {
        ...state,
        loading: false
      }
    );
  }),
  on(OtausActions.getOtauFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  })),

  on(OtausActions.setRouterSelectedOtauOcmPortIndex, (state, { ocmPortIndex }) => ({
    ...state,
    routerSelectedOtauOcmPortIndex: ocmPortIndex
  }))
);

export function otausReducer(state: OtausState | undefined, action: any): OtausState {
  return reducer(state, action);
}
