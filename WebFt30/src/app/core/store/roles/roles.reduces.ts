import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter } from '@ngrx/entity';
import { Role } from '../models';
import { RolesState } from './roles.state';
import { RolesActions } from './roles.actions';

export const RolesStateAdapter = createEntityAdapter<Role>({
  selectId: (role: Role) => role.name
});

export const initialState: RolesState = RolesStateAdapter.getInitialState({
  loaded: false,
  loading: false,
  errorMessageId: null
});

const reducer = createReducer(
  initialState,
  on(RolesActions.getRoles, (state) => {
    return RolesStateAdapter.removeAll({
      ...state,
      loaded: false,
      loading: true,
      errorMessageId: null
    });
  }),
  on(RolesActions.getRolesSuccess, (state, { roles }) => {
    return RolesStateAdapter.setAll(roles, {
      ...state,
      loaded: true,
      loading: false
    });
  }),
  on(RolesActions.getRolesFailure, (state, { errorMessageId }) => ({
    ...state,
    loading: false,
    errorMessageId
  }))
);

export function rolesReducer(state: RolesState | undefined, action: any): RolesState {
  return reducer(state, action);
}
