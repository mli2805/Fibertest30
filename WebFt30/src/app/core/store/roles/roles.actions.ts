import { createAction, props } from '@ngrx/store';
import { Role } from '../models';

const getRoles = createAction('[Roles] Get Roles');
const getRolesSuccess = createAction('[Roles] Get Roles Success', props<{ roles: Role[] }>());
const getRolesFailure = createAction(
  '[Roles] Get Roles Failure',
  props<{ errorMessageId: string }>()
);

export const RolesActions = {
  getRoles,
  getRolesSuccess,
  getRolesFailure
};
