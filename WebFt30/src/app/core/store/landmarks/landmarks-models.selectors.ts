import { createSelector } from '@ngrx/store';
import { LandmarksModelsStateAdapter } from './landmarks-models.reducer';
import { LandmarksModelsState } from './landmarks-models.state';
import { selectLandmarksModelsState } from '../../core.state';

const { selectIds, selectEntities, selectAll, selectTotal } =
  LandmarksModelsStateAdapter.getSelectors();

const selectLoaded = createSelector(
  selectLandmarksModelsState,
  (state: LandmarksModelsState) => state.loaded
);

const selectLoading = createSelector(
  selectLandmarksModelsState,
  (state: LandmarksModelsState) => state.loading
);

const selectProgress = createSelector(
  selectLandmarksModelsState,
  (state: LandmarksModelsState) => state.progress
);

const selectErrorMessageId = createSelector(
  selectLandmarksModelsState,
  (state: LandmarksModelsState) => state.errorMessageId
);

const selectLandmarksModelById = (landmarksModelId: string) =>
  createSelector(selectLandmarksModelsState, (state: LandmarksModelsState) => {
    return state.entities[landmarksModelId];
  });

export const LandmarksModelsSelectors = {
  selectLoaded,
  selectLoading,
  selectProgress,
  selectErrorMessageId,
  selectLandmarksModelById
};
