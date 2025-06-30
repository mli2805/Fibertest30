import { createAction, props } from '@ngrx/store';
import { ColoredLandmark, LandmarksModel } from '../models/ft30/colored-landmark';

const createLandmarksModel = createAction(
  '[LandmarksModels] Create Lanmdmark Model',
  props<{ landmarksModelId: string; traceId: string }>()
);
const createLandmarksModelSuccess = createAction(
  '[LandmarksModels] Create Lanmdmark Model Success'
);
const createLandmarksModelFailure = createAction(
  '[LandmarksModels] Create Lanmdmark Model Failure',
  props<{ errorMessageId: string }>()
);

const updateLandmarksModel = createAction(
  '[LandmarksModels] Update Lanmdmark Model',
  props<{
    landmarksModelId: string;
    changedLandmark: ColoredLandmark | undefined;
    isFilterOn: boolean | undefined;
  }>()
);
const updateLandmarksModelSuccess = createAction(
  '[LandmarksModels] Update Lanmdmark Model Success'
);
const updateLandmarksModelFailure = createAction(
  '[LandmarksModels] Update Lanmdmark Model Failure',
  props<{ errorMessageId: string }>()
);

const getLandmarksModel = createAction(
  '[LandmarksModels] Get Lanmdmark Model',
  props<{ landmarksModelId: string }>()
);
const getLandmarksModelSuccess = createAction(
  '[LandmarksModels] Get Lanmdmark Model Success',
  props<{ landmarksModel: LandmarksModel }>()
);
const getLandmarksModelFailure = createAction(
  '[LandmarksModels] Get Lanmdmark Model Failure',
  props<{ errorMessageId: string }>()
);

const deleteLandmarksModel = createAction(
  '[LandmarksModels] Delete Lanmdmark Model',
  props<{ landmarksModelId: string }>()
);
const deleteLandmarksModelSuccess = createAction(
  '[LandmarksModels] Delete Lanmdmark Model Success',
  props<{ landmarksModelId: string }>()
);
const deleteLandmarksModelFailure = createAction(
  '[LandmarksModels] Delete Lanmdmark Model Failure',
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
  deleteLandmarksModelFailure
};
