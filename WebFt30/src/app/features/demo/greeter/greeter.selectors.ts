import { createSelector } from '@ngrx/store';

import { DemoState, selectDemoState } from '../demo.state';

const selectGreeterState = createSelector(
  selectDemoState,
  (state: DemoState) => state.greeter
);

const selectMessage = createSelector(selectGreeterState, (state) => state.message);
const selectError = createSelector(selectGreeterState, (state) => state.error);
const selectLoading = createSelector(selectGreeterState, (state) => state.loading);

export const GreeterSelectors = {
  selectGreeterState,
  selectMessage,
  selectError,
  selectLoading
};
