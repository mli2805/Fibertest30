import { AlarmProfilesState } from './alarm-profiles.state';
import { createReducer, on } from '@ngrx/store';
import { AlarmProfilesActions } from './alarm-profiles.actions';
import { createEntityAdapter } from '@ngrx/entity';
import { AlarmProfile } from '../models/alarm-profile';
import { DeviceActions } from '../device/device.actions';

export const AlarmProfilesStateAdapter = createEntityAdapter<AlarmProfile>({
  selectId: (alarmProfile: AlarmProfile) => alarmProfile.id
});

export const initialState: AlarmProfilesState = AlarmProfilesStateAdapter.getInitialState({
  loaded: false,
  loading: false,
  errorMessageId: null
});

const reducer = createReducer(
  initialState,

  on(DeviceActions.loadDeviceInfo, (state) => {
    return AlarmProfilesStateAdapter.removeAll({
      ...state
    });
  }),
  on(DeviceActions.loadDeviceInfoSuccess, (state, { deviceInfo }) => {
    return AlarmProfilesStateAdapter.setAll(deviceInfo.alarmProfiles, {
      ...state
    });
  }),

  on(AlarmProfilesActions.updateAlarmProfile, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  })),
  on(AlarmProfilesActions.updateAlarmProfileFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  })),

  on(AlarmProfilesActions.getUpdatedAlarmProfileSuccess, (state, { profile }) => {
    return AlarmProfilesStateAdapter.updateOne(
      { id: profile.id, changes: profile },
      {
        ...state,
        loading: false
      }
    );
  }),
  on(AlarmProfilesActions.getUpdatedAlarmProfileFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  })),

  on(AlarmProfilesActions.createAlarmProfile, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  })),
  on(AlarmProfilesActions.createAlarmProfileFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  })),

  on(AlarmProfilesActions.getCreatedAlarmProfileSuccess, (state, { profile }) => {
    return AlarmProfilesStateAdapter.addOne(profile, {
      ...state,
      loading: false
    });
  }),
  on(AlarmProfilesActions.getCreatedAlarmProfileFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  })),

  on(AlarmProfilesActions.deleteAlarmProfile, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  })),
  on(AlarmProfilesActions.deleteAlarmProfileFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  })),
  on(AlarmProfilesActions.deleteAlarmProfileSuccess, (state, { alarmProfileId }) => {
    return AlarmProfilesStateAdapter.removeOne(alarmProfileId, { ...state, loading: false });
  })
);

export function alarmProfilesReducer(
  state: AlarmProfilesState | undefined,
  action: any
): AlarmProfilesState {
  return reducer(state, action);
}
