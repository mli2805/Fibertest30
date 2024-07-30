import { createAction, props } from '@ngrx/store';
import { Rtu } from '../models/ft30/rtu';

const refreshRtuTree = createAction('[RtuTree] Refresh Rtu Tree');
const refreshRtuTreeSuccess = createAction(
  '[RtuTree] Refresh Rtu Tree Success',
  props<{ rtus: Rtu[] }>()
);
const refreshRtuTreeFailure = createAction(
  '[RtuTree] Refresh Rtu Tree Failure',
  props<{ errorMessageId: string }>()
);

const getOneRtu = createAction('[RtuTree] Get One Rtu', props<{ rtuId: string }>());
const getOneRtuSuccess = createAction('[RtuTree] Get One Rtu Success', props<{ rtu: Rtu }>());
const getOneRtuFailure = createAction(
  '[RtuTree] Get One Rtu Failure',
  props<{ errorMessageId: string }>()
);

export const RtuTreeActions = {
  refreshRtuTree,
  refreshRtuTreeSuccess,
  refreshRtuTreeFailure,

  getOneRtu,
  getOneRtuSuccess,
  getOneRtuFailure
};
