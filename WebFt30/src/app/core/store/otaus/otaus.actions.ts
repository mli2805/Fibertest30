import { createAction, props } from '@ngrx/store';
import { Otau } from '../models';

const otauConnectionStatusChanged = createAction(
  '[Otaus] Otau Connection Status Changed',
  props<{ otauId: number; isConnected: boolean; onlineAt: Date | null; offlineAt: Date | null }>()
);

const getOtau = createAction('[Otaus] Get Otau', props<{ otauId: number }>());
const getOtauSuccess = createAction('[Otaus] Get Otau Success', props<{ otau: Otau }>());
const getOtauFailure = createAction(
  '[Otaus] Get Otau Failure',
  props<{ errorMessageId: string }>()
);

const resetError = createAction('[Otaus] Reset Error');

const setRouterSelectedOtauOcmPortIndex = createAction(
  '[Otaus] Set Router Selected Otau Ocm Port Index',
  props<{ ocmPortIndex: number }>()
);

export const OtausActions = {
  otauConnectionStatusChanged,
  getOtau,
  getOtauSuccess,
  getOtauFailure,
  resetError,
  setRouterSelectedOtauOcmPortIndex
};
