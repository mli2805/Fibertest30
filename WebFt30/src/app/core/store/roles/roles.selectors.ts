import { createSelector } from '@ngrx/store';
import { selectRolesState } from '../../core.state';
import { RolesState } from './roles.state';
import { RolesStateAdapter } from './roles.reduces';

const { selectIds, selectEntities, selectAll, selectTotal } = RolesStateAdapter.getSelectors();

const selectRoles = createSelector(selectRolesState, (state: RolesState) => state);

const selectRolesRoles = createSelector(selectRoles, selectAll);

const selectLoaded = createSelector(selectRoles, (state: RolesState) => state.loaded);

const selectLoading = createSelector(selectRoles, (state: RolesState) => state.loading);

const selectErrorMessageId = createSelector(
  selectRoles,
  (state: RolesState) => state.errorMessageId
);

export const RolesSelectors = {
  selectRoles,
  selectRolesRoles,
  selectLoaded,
  selectLoading,
  selectErrorMessageId
};
