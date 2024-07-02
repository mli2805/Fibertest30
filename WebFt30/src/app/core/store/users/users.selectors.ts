import { createSelector } from '@ngrx/store';
import { selectUsersState } from '../../core.state';
import { UsersState } from './users.state';
import { UserStateAdapter } from './users.reducer';

const { selectIds, selectEntities, selectAll, selectTotal } = UserStateAdapter.getSelectors();

const selectUsers = createSelector(selectUsersState, (state: UsersState) => state);

const selectUsersUsers = createSelector(selectUsers, selectAll);

const selectLoaded = createSelector(selectUsers, (state: UsersState) => state.loaded);

const selectLoading = createSelector(selectUsers, (state: UsersState) => state.loading);

const selectErrorMessageId = createSelector(
  selectUsers,
  (state: UsersState) => state.errorMessageId
);

export const selectUserById = (userId: string) =>
  createSelector(selectUsers, (state: UsersState) => {
    return state.entities[userId];
  });

export const UsersSelectors = {
  selectUsers,
  selectUsersUsers,
  selectLoaded,
  selectLoading,
  selectUserById,
  selectErrorMessageId
};
