import { createAction, props } from '@ngrx/store';
import { ServerError } from '../../models/server-error';
import { CompletedOnDemand } from '../models';

const getOnDemands = createAction(
  '[OnDemandHistory] Get On Demands',
  props<{ monitoringPortIds: number[] }>()
);
const getOnDemandsSuccess = createAction(
  '[OnDemandHistory] Get On Demands Success',
  props<{ onDemands: CompletedOnDemand[] }>()
);

const getOnDemandsFailure = createAction(
  '[OnDemandHistory] Get On Demands Failure',
  props<{ error: ServerError }>()
);

const resetError = createAction('[OnDemandHistory] Reset Error');

const higlightOnDemand = createAction(
  '[OnDemandHistory] Highlight On Demand',
  props<{ onDemandId: string }>()
);

const resetHiglightOnDemand = createAction('[OnDemandHistory] Reset Highlight On Demand');

export const OnDemandHistoryActions = {
  getOnDemands,
  getOnDemandsSuccess,
  getOnDemandsFailure,
  resetError,
  higlightOnDemand,
  resetHiglightOnDemand
};
