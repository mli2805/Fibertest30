import { createEntityAdapter } from '@ngrx/entity';
import { LandmarksModel } from '../models/ft30/colored-landmark';
import { LandmarksModelsState } from './landmarks-models.state';
import { createReducer, on } from '@ngrx/store';
import { LandmarksModelsActions } from './landmarks-models.actions';

export const LandmarksModelsStateAdapter = createEntityAdapter<LandmarksModel>({
  selectId: (landmarksModel: LandmarksModel) => landmarksModel.landmarksModelId
});

export const initialState: LandmarksModelsState = LandmarksModelsStateAdapter.getInitialState({
  loaded: false,
  loading: false,
  errorMessageId: null,
  progress: []
});

const reducer = createReducer(
  initialState,
  on(LandmarksModelsActions.createLandmarksModel, (state) => ({
    ...state,
    loading: true,
    loaded: false,
    errorMessageId: null
  })),
  on(LandmarksModelsActions.updateLandmarksModel, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  })),
  on(LandmarksModelsActions.cancelOneLandmarkChanges, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  })),
  on(LandmarksModelsActions.clearLandmarksModel, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  })),
  on(LandmarksModelsActions.applyLandmarkChanges, (state) => ({
    ...state,
    errorMessageId: null,
    progress: []
  })),
  on(
    LandmarksModelsActions.getLandmarksModelSuccess,
    (state, { landmarksModel: landmarksModel }) => {
      return LandmarksModelsStateAdapter.upsertOne(landmarksModel, {
        ...state,
        loading: false,
        loaded: true
      });
    }
  ),
  on(
    LandmarksModelsActions.deleteLandmarksModelSuccess,
    (state, { landmarksModelId: landmarksModelsId }) => {
      return LandmarksModelsStateAdapter.removeOne(landmarksModelsId, { ...state, loading: false });
    }
  ),

  on(LandmarksModelsActions.updateLandmarksProgress, (state, { line }) => ({
    ...state,
    loading: true,
    errorMessageId: null,
    progress: [...state.progress, line]
  }))
);

export function landmarksModelsReducer(
  state: LandmarksModelsState | undefined,
  action: any
): LandmarksModelsState {
  return reducer(state, action);
}
