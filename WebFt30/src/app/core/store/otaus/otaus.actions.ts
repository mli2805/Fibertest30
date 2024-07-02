import { createAction, props } from '@ngrx/store';
import { OtauPatch } from 'src/app/features/rfts-setup/rfts-setup/otau-card/otau-patch';
import { Otau } from '../models';

const otauConnectionStatusChanged = createAction(
  '[Otaus] Otau Connection Status Changed',
  props<{ otauId: number; isConnected: boolean; onlineAt: Date | null; offlineAt: Date | null }>()
);

const updateOtau = createAction(
  '[Otaus] Update Otau',
  props<{ otauId: number; patch: OtauPatch }>()
);
const updateOtauSuccess = createAction('[Otaus] Update Otau Success', props<{ otauId: number }>());
const updateOtauFailure = createAction(
  '[Otaus] Update Otau Failure',
  props<{ errorMessageId: string }>()
);

const getOtau = createAction('[Otaus] Get Otau', props<{ otauId: number }>());
const getOtauSuccess = createAction('[Otaus] Get Otau Success', props<{ otau: Otau }>());
const getOtauFailure = createAction(
  '[Otaus] Get Otau Failure',
  props<{ errorMessageId: string }>()
);

const resetError = createAction('[Otaus] Reset Error');

const removeOtau = createAction('[Otaus] Remove Otau', props<{ otauId: number }>());
const removeOtauSuccess = createAction('[Otaus] Remove Otau Success', props<{ otauId: number }>());
const removeOtauFailure = createAction(
  '[Otaus] Remove Otau Failure',
  props<{ errorMessageId: string }>()
);

const addOsmOtau = createAction(
  '[Otaus] Add Osm Otau',
  props<{ ocmPortIndex: number; chainAddress: number }>()
);
const addOxcOtau = createAction(
  '[Otaus] Add Oxc Otau',
  props<{ ocmPortIndex: number; ipAddress: string; port: number }>()
);
const addOtauSuccess = createAction('[Otaus] Add Otau Success', props<{ otauId: number }>());
const addOtauFailure = createAction(
  '[Otaus] Add Otau Failure',
  props<{ errorMessageId: string }>()
);

const getCreatedOtau = createAction('[Otaus] Get Created Otau', props<{ otauId: number }>());
const getCreatedOtauSuccess = createAction(
  '[Otaus] Get Created Otau Success',
  props<{ otau: Otau }>()
);
const getCreatedOtauFailure = createAction(
  '[Otaus] Get Created Otau Failure',
  props<{ errorMessageId: string }>()
);

const setRouterSelectedOtauOcmPortIndex = createAction(
  '[Otaus] Set Router Selected Otau Ocm Port Index',
  props<{ ocmPortIndex: number }>()
);

export const OtausActions = {
  otauConnectionStatusChanged,

  updateOtau,
  updateOtauSuccess,
  updateOtauFailure,

  getOtau,
  getOtauSuccess,
  getOtauFailure,

  removeOtau,
  removeOtauSuccess,
  removeOtauFailure,

  addOsmOtau,
  addOxcOtau,
  addOtauSuccess,
  addOtauFailure,

  getCreatedOtau,
  getCreatedOtauSuccess,
  getCreatedOtauFailure,

  resetError,

  setRouterSelectedOtauOcmPortIndex
};
