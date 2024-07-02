import { createAction, props } from '@ngrx/store';
import { AlarmProfile } from 'src/app/core/store/models/alarm-profile';

const updateAlarmProfile = createAction(
  '[AlarmProfiles] Update Alarm Profile',
  props<{ profile: AlarmProfile }>()
);

const updateAlarmProfileSuccess = createAction(
  '[AlarmProfiles] Update Alarm Profile Success',
  props<{ profileId: number }>()
);

const updateAlarmProfileFailure = createAction(
  '[AlarmProfiles] Update Alarm Profile Failure',
  props<{ errorMessageId: string }>()
);

const getUpdatedAlarmProfile = createAction(
  '[AlarmProfiles] Get Updated Alarm Profile',
  props<{ profileId: number }>()
);

const getUpdatedAlarmProfileSuccess = createAction(
  '[AlarmProfiles] Get Updated Alarm Profile Success',
  props<{ profile: AlarmProfile }>()
);

const getUpdatedAlarmProfileFailure = createAction(
  '[AlarmProfiles] Get Updated Alarm Profile Failure',
  props<{ errorMessageId: string }>()
);

const createAlarmProfile = createAction(
  '[AlarmProfiles] Create Alarm Profile',
  props<{ profile: AlarmProfile }>()
);

const createAlarmProfileSuccess = createAction(
  '[AlarmProfiles] Create Alarm Profile Success',
  props<{ profileId: number }>()
);

const createAlarmProfileFailure = createAction(
  '[AlarmProfiles] Create Alarm Profile Failure',
  props<{ errorMessageId: string }>()
);

const getCreatedAlarmProfile = createAction(
  '[AlarmProfiles] Get Created Alarm Profile',
  props<{ profileId: number }>()
);

const getCreatedAlarmProfileSuccess = createAction(
  '[AlarmProfiles] Get Created Alarm Profile Success',
  props<{ profile: AlarmProfile }>()
);

const getCreatedAlarmProfileFailure = createAction(
  '[AlarmProfiles] Get Created Alarm Profile Failure',
  props<{ errorMessageId: string }>()
);

const deleteAlarmProfile = createAction(
  '[AlarmProfiles] Delete Alarm Profile',
  props<{ alarmProfileId: number }>()
);

const deleteAlarmProfileSuccess = createAction(
  '[AlarmProfiles] Delete Alarm Profile Success',
  props<{ alarmProfileId: number }>()
);

const deleteAlarmProfileFailure = createAction(
  '[AlarmProfiles] Delete Alarm Profile Failure',
  props<{ errorMessageId: string }>()
);

export const AlarmProfilesActions = {
  updateAlarmProfile,
  updateAlarmProfileSuccess,
  updateAlarmProfileFailure,

  getUpdatedAlarmProfile,
  getUpdatedAlarmProfileSuccess,
  getUpdatedAlarmProfileFailure,

  createAlarmProfile,
  createAlarmProfileSuccess,
  createAlarmProfileFailure,

  getCreatedAlarmProfile,
  getCreatedAlarmProfileSuccess,
  getCreatedAlarmProfileFailure,

  deleteAlarmProfile,
  deleteAlarmProfileSuccess,
  deleteAlarmProfileFailure
};
