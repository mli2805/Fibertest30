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
  errorMessageId: null
});

const reducer = createReducer(
  initialState,
  on(LandmarksModelsActions.createLandmarksModel, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  })),
  on(
    LandmarksModelsActions.getLandmarksModelSuccess,
    (state, { landmarksModel: landmarksModel }) => {
      return LandmarksModelsStateAdapter.upsertOne(landmarksModel, {
        ...state,
        loading: false
      });
    }
  )
);

export function landmarksModelsReducer(
  state: LandmarksModelsState | undefined,
  action: any
): LandmarksModelsState {
  return reducer(state, action);
}
