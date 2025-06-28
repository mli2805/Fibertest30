import { createAction, props } from '@ngrx/store';
import { LandmarksModel } from '../models/ft30/colored-landmark';

const createLandmarksModel = createAction(
  '[LandmarksModels] Create Lanmdmark Model',
  props<{ landmarksModelId: string; traceId: string; gpsInputMode: string }>()
);
const createLandmarksModelSuccess = createAction(
  '[LandmarksModels] Create Lanmdmark Model Success'
);
const createLandmarksModelFailure = createAction(
  '[LandmarksModels] Create Lanmdmark Model Failure',
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

export const LandmarksModelsActions = {
  createLandmarksModel,
  createLandmarksModelSuccess,
  createLandmarksModelFailure,

  getLandmarksModel,
  getLandmarksModelSuccess,
  getLandmarksModelFailure,

  deleteLandmarksModel
};
