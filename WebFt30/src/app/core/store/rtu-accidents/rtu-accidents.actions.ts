import { createAction, props } from '@ngrx/store';
import { ServerError } from '../../models/server-error';
import { RtuAccident } from '../models/ft30/rtu-accident';
import { DateTimeRange } from 'src/grpc-generated/events.data';

const getRtuAccidents = createAction(
  '[RtuAccidents] Get Rtu Accidents',
  props<{
    currentAccidents: boolean;
    orderDescending: boolean;
    searchWindow: DateTimeRange | null;
  }>()
);
const getRtuAccidentsSuccess = createAction(
  '[RtuAccidents] Get Rtu Accidents Success',
  props<{ rtuAccidents: RtuAccident[] }>()
);

const getRtuAccidentsFailure = createAction(
  '[RtuAccidents] Get Rtu Accidents Failure',
  props<{ error: ServerError }>()
);

const loadNextRtuAccidents = createAction(
  '[RtuAccidents] LoadNext Rtu Accidents',
  props<{
    currentAccidents: boolean;
    orderDescending: boolean;
    lastLoaded: Date;
    searchWindow: DateTimeRange | null;
  }>()
);
const loadNextRtuAccidentsSuccess = createAction(
  '[RtuAccidents] LoadNext Rtu Accidents Success',
  props<{ rtuAccidents: RtuAccident[] }>()
);

const loadNextRtuAccidentsFailure = createAction(
  '[RtuAccidents] LoadNext Rtu Accidents Failure',
  props<{ error: ServerError }>()
);

const resetError = createAction('[RtuAccidents] Reset Error');

export const RtuAccidentsActions = {
  getRtuAccidents,
  getRtuAccidentsSuccess,
  getRtuAccidentsFailure,

  loadNextRtuAccidents,
  loadNextRtuAccidentsSuccess,
  loadNextRtuAccidentsFailure,
  resetError
};
