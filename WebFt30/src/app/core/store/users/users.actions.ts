import { createAction, props } from '@ngrx/store';
import { ApplicationUserPatch } from 'src/app/features/rfts-setup/components/platform-management/user-accounts/components/user-edit-dialog/application-user-patch';
import { User } from '../models';

const getUsers = createAction('[Users] Get Users');
const getUsersSuccess = createAction('[Users] Get Users Success', props<{ users: User[] }>());
const getUsersFailure = createAction(
  '[Users] Get Users Failure',
  props<{ errorMessageId: string }>()
);

const createUser = createAction('[Users] Create User', props<{ patch: ApplicationUserPatch }>());
const createUserSuccess = createAction('[Users] Create User Success', props<{ userId: string }>());
const createUserFailure = createAction(
  '[Users] Create User Failure',
  props<{ errorMessageId: string }>()
);
const createUserGetUser = createAction('[Users] Create User Get User', props<{ userId: string }>());
const createUserGetUserSuccess = createAction(
  '[Users] Create User Get User Success',
  props<{ user: User }>()
);
const createUserGetUserFailure = createAction(
  '[Users] Create User Get User Failure',
  props<{ errorMessageId: string }>()
);

const updateUser = createAction(
  '[Users] Update User',
  props<{ userId: string; patch: ApplicationUserPatch; outsidePageCall: boolean }>()
);
const updateUserSuccess = createAction('[Users] Update User Success', props<{ userId: string }>());
const updateUserFailure = createAction(
  '[Users] Update User Failure',
  props<{ errorMessageId: string }>()
);

const updateUserGetUser = createAction('[Users] Update User Get User', props<{ userId: string }>());
const updateUserGetUserSuccess = createAction(
  '[Users] Update User Get User Success',
  props<{ user: User }>()
);
const updateUserGetUserFailure = createAction(
  '[Users] Update User Get User Failure',
  props<{ errorMessageId: string }>()
);

const deleteUser = createAction('[Users] Delete User', props<{ userId: string }>());
const deleteUserSuccess = createAction('[Users] Delete User Success', props<{ userId: string }>());
const deleteUserFailure = createAction(
  '[Users] Delete User Failure',
  props<{ errorMessageId: string }>()
);

const resetError = createAction('[Users] Reset Error');

export const UsersActions = {
  getUsers,
  getUsersSuccess,
  getUsersFailure,

  createUser,
  createUserFailure,
  createUserSuccess,
  createUserGetUser,
  createUserGetUserSuccess,
  createUserGetUserFailure,

  updateUser,
  updateUserFailure,
  updateUserSuccess,
  updateUserGetUser,
  updateUserGetUserSuccess,
  updateUserGetUserFailure,

  deleteUser,
  deleteUserFailure,
  deleteUserSuccess,

  resetError
};
