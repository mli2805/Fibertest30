import { createAction, props } from '@ngrx/store';
import { ColoredLandmark, LandmarksModel } from '../models/ft30/colored-landmark';

const createLandmarksModel = createAction(
  '[LandmarksModels] Create Landmark Model',
  props<{ landmarksModelId: string; traceId: string }>()
);
const createLandmarksModelSuccess = createAction('[LandmarksModels] Create Landmark Model Success');
const createLandmarksModelFailure = createAction(
  '[LandmarksModels] Create Landmark Model Failure',
  props<{ errorMessageId: string }>()
);

const updateLandmarksModel = createAction(
  '[LandmarksModels] Update Landmark Model',
  props<{
    landmarksModelId: string;
    changedLandmark: ColoredLandmark | undefined;
    isFilterOn: boolean | undefined;
  }>()
);
const updateLandmarksModelSuccess = createAction('[LandmarksModels] Update Landmark Model Success');
const updateLandmarksModelFailure = createAction(
  '[LandmarksModels] Update Landmark Model Failure',
  props<{ errorMessageId: string }>()
);

const getLandmarksModel = createAction(
  '[LandmarksModels] Get Landmark Model',
  props<{ landmarksModelId: string }>()
);
const getLandmarksModelSuccess = createAction(
  '[LandmarksModels] Get Landmark Model Success',
  props<{ landmarksModel: LandmarksModel }>()
);
const getLandmarksModelFailure = createAction(
  '[LandmarksModels] Get Landmark Model Failure',
  props<{ errorMessageId: string }>()
);

const deleteLandmarksModel = createAction(
  '[LandmarksModels] Delete Landmark Model',
  props<{ landmarksModelId: string }>()
);
const deleteLandmarksModelSuccess = createAction(
  '[LandmarksModels] Delete Landmark Model Success',
  props<{ landmarksModelId: string }>()
);
const deleteLandmarksModelFailure = createAction(
  '[LandmarksModels] Delete Landmark Model Failure',
  props<{ errorMessageId: string }>()
);

const clearLandmarksModel = createAction(
  '[LandmarksModels] Clear Landmark Model',
  props<{ landmarksModelId: string }>()
);
const clearLandmarksModelSuccess = createAction(
  '[LandmarksModels] Clear Landmark Model Success',
  props<{ landmarksModelId: string }>()
);
const clearLandmarksModelFailure = createAction(
  '[LandmarksModels] Clear Landmark Model Failure',
  props<{ errorMessageId: string }>()
);

export const LandmarksModelsActions = {
  createLandmarksModel,
  createLandmarksModelSuccess,
  createLandmarksModelFailure,

  updateLandmarksModel,
  updateLandmarksModelSuccess,
  updateLandmarksModelFailure,

  getLandmarksModel,
  getLandmarksModelSuccess,
  getLandmarksModelFailure,

  deleteLandmarksModel,
  deleteLandmarksModelSuccess,
  deleteLandmarksModelFailure,

  clearLandmarksModel,
  clearLandmarksModelSuccess,
  clearLandmarksModelFailure
};
