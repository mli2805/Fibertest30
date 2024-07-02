import { createReducer, on } from '@ngrx/store';
import { UsersState } from './users.state';
import { UsersActions } from './users.actions';
import { createEntityAdapter } from '@ngrx/entity';
import { User } from '../models/user';

export const UserStateAdapter = createEntityAdapter<User>({
  selectId: (user: User) => user.id
});

export const initialState: UsersState = UserStateAdapter.getInitialState({
  loaded: false,
  loading: false,
  errorMessageId: null
});

const reducer = createReducer(
  initialState,
  on(UsersActions.resetError, (state) => ({
    ...state,
    errorMessageId: null
  })),
  on(UsersActions.getUsers, (state) => {
    return UserStateAdapter.removeAll({
      ...state,
      loaded: false,
      loading: true,
      errorMessageId: null
    });
  }),
  on(UsersActions.getUsersSuccess, (state, { users }) => {
    return UserStateAdapter.setAll(users, {
      ...state,
      loaded: true,
      loading: false
    });
  }),
  on(UsersActions.getUsersFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  })),

  on(UsersActions.createUser, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  })),
  on(UsersActions.createUserGetUserSuccess, (state, { user }) => {
    return UserStateAdapter.addOne(user, {
      ...state,
      loading: false
    });
  }),
  on(UsersActions.createUserGetUserFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  })),

  on(UsersActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  })),
  on(UsersActions.deleteUserFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  })),
  on(UsersActions.deleteUserSuccess, (state, { userId }) => {
    return UserStateAdapter.removeOne(userId, { ...state, loading: false });
  }),

  on(UsersActions.updateUser, (state) => ({
    ...state,
    loading: true,
    errorMessageId: null
  })),
  on(UsersActions.updateUserFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  })),
  on(UsersActions.updateUserGetUserSuccess, (state, { user }) => {
    return UserStateAdapter.updateOne(
      {
        id: user.id,
        changes: user
      },
      {
        ...state,
        loading: false
      }
    );
  }),
  on(UsersActions.updateUserGetUserFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  }))
);

export function usersReducer(state: UsersState | undefined, action: any): UsersState {
  return reducer(state, action);
}
