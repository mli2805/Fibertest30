import { createAction, props } from '@ngrx/store';
import { ServerError } from '../../models/server-error';
import { RtuAccident } from '../models/ft30/rtu-accident';

const getRtuAccidents = createAction(
  '[RtuAccidents] Get Rtu Accidents',
  props<{ currentAccidents: boolean }>()
);
const getRtuAccidentsSuccess = createAction(
  '[RtuAccidents] Get Rtu Accidents Success',
  props<{ rtuAccidents: RtuAccident[] }>()
);

const getRtuAccidentsFailure = createAction(
  '[RtuAccidents] Get Rtu Accidents Failure',
  props<{ error: ServerError }>()
);

const resetError = createAction('[RtuAccidents] Reset Error');

export const RtuAccidentsActions = {
  getRtuAccidents,
  getRtuAccidentsSuccess,
  getRtuAccidentsFailure,
  resetError
};