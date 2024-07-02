import { createSelector } from '@ngrx/store';
import { AlarmProfilesState } from './alarm-profiles.state';
import { selectAlarmProfilesState } from '../../core.state';
import { AlarmProfilesStateAdapter } from './alarm-profiles.reducer';

const { selectAll } = AlarmProfilesStateAdapter.getSelectors();

const selectAlarmProfilesPartOfStore = createSelector(
  selectAlarmProfilesState,
  (state: AlarmProfilesState) => state
);

const selectAlarmProfilesArray = createSelector(selectAlarmProfilesPartOfStore, selectAll);

const selectLoaded = createSelector(
  selectAlarmProfilesPartOfStore,
  (state: AlarmProfilesState) => state.loaded
);

const selectLoading = createSelector(
  selectAlarmProfilesPartOfStore,
  (state: AlarmProfilesState) => state.loading
);

const selectErrorMessageId = createSelector(
  selectAlarmProfilesPartOfStore,
  (state: AlarmProfilesState) => state.errorMessageId
);

export const AlarmProfilesSelectors = {
  selectAlarmProfilesArray,
  selectLoaded,
  selectLoading,
  selectErrorMessageId
};
